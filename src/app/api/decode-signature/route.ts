import { createSupabaseServerSide } from "@/lib/supabase/supabase-server-side";
import { decodeTxSignature } from "@/util/solana/decoder/txDecoder";
import { getTokenPrice } from "@/util/solana/getTokenPrice";
import { getMint } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { txHash } = await request.json();
    const rpcConnection = new Connection("https://api.devnet.solana.com");
    const result = await decodeTxSignature(rpcConnection, [txHash]);
    console.log(result);
    if (!result) {
      return NextResponse.json({ error: "Decoding Error" }, { status: 404 });
    }

    const decoded_data = result[txHash];
    console.log(decoded_data);

    let response_data = [];
    let error = null;

    for (var i = 0; i < decoded_data.length; i++) {
      console.log(i);
      console.log(decoded_data[i].created_at);
      const functionName = decoded_data[i].functionName;
      const params = decoded_data[i].params;

      const supabase = createSupabaseServerSide();

      switch (functionName) {
        case "createToken":
          try {
            let { data, error } = await supabase
              .from("tokens")
              .select(`id`)
              .eq("id", params.mintAccount);
            if (data?.length! > 0) {
              response_data.push({
                message: "Tx Hash Already Indexed in DP for createToken",
              });
              break;
            }
          } catch (error) {
            return NextResponse.json(
              { error: "Internal Server Error" },
              { status: 500 }
            );
          }

          const metadata = params.metadata;
          console.log(metadata.uri);
          const response = await axios.get(metadata.uri);

          const metadata_parsed = response.data;

          let { data, error } = await supabase
            .from("tokens")
            .insert([
              {
                create_signature: txHash,
                description: metadata_parsed.description,
                name: metadata_parsed.name,
                symbol: metadata_parsed.symbol,
                id: params.mintAccount,
                image: metadata_parsed.image,
                metadata_uri: metadata.uri,
                owner: params.payer,
                created_at: new Date(
                  decoded_data[i].created_at * 1000
                ).toISOString(),
              },
            ])
            .select();
          console.log(data, error);
          if (!error) {
            response_data.push(data);
          } else {
            error = error;
          }
        case "buyTokens":
          try {
            try {
              let { data, error } = await supabase
                .from("trades")
                .select(`id,trade_signature`)
                .eq("trade_signature", txHash);
              if (data?.length! > 0) {
                response_data.push({
                  message: "Tx Hash Already Indexed in DP for buyTokens",
                });
                break;
              }
            } catch (error) {
              return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
              );
            }

            const token_price = decoded_data[i].price;

            let { data, error } = await supabase
              .from("trades")
              .insert([
                {
                  amount: params.solAmount,
                  token_traded: params.mintAccount,
                  trader_address: params.payer,
                  trade_type: "buy_tokens",
                  price: token_price.toString(),
                  trade_signature: txHash,
                  created_at: new Date(
                    decoded_data[i].created_at * 1000
                  ).toISOString(),
                },
              ])
              .select();
            console.log(data);
            console.log(error);
            if (!error) {
              response_data.push(data);
            } else {
              error = error;
            }
          } catch (error) {
            console.log(error);
            return NextResponse.json(
              { error: "Internal Server Error" },
              { status: 500 }
            );
          }

        case "sellTokens":
          try {
            try {
              let { data, error } = await supabase
                .from("trades")
                .select(`id,trade_signature`)
                .eq("trade_signature", txHash);
              if (data?.length! > 0) {
                response_data.push({
                  message: "Tx Hash Already Indexed in DP for sellTokens",
                });
                break;
              }
            } catch (error) {
              return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
              );
            }
            const token_price = decoded_data[i].price;

            let { data, error } = await supabase
              .from("trades")
              .insert([
                {
                  amount: params.tokenAmount,
                  token_traded: params.mintAccount,
                  trader_address: params.signer,
                  trade_type: "sell_tokens",
                  price: token_price.toString(),
                  trade_signature: txHash,
                  created_at: new Date(
                    decoded_data[i].created_at * 1000
                  ).toISOString(),
                },
              ])
              .select();
            console.log(data);
            console.log(error);
            if (!error) {
              response_data.push(data);
            } else {
              error = error;
            }
          } catch (error) {
            console.log(error);
            return NextResponse.json(
              { error: "Internal Server Error" },
              { status: 500 }
            );
          }
        case "highlightToken":
          try {
            console.log("hit");
            // try {
            //   let { data, error } = await supabase
            //     .from("highlights")
            //     .select(`id,highlight_signature`)
            //     .eq("highlight_signature", txHash);
            //   if (data?.length! > 0) {
            //     response_data.push({
            //       message: "Tx Hash Already Indexed in DP for tokenHighlights",
            //     });
            //     break;
            //   }
            // } catch (error) {
            //   return NextResponse.json(
            //     { error: "Internal Server Error" },
            //     { status: 500 }
            //   );
            // }
            const price_paid = decoded_data[i].price_paid;

            const { data, error } = await supabase.rpc("create_highlight", {
              p_highlight_signature: txHash,
              p_price_paid: price_paid,
              p_position: params.position,
              p_slot_hours: params.slotHours,
              p_token_id: params.mintAccount,
              p_creator_address: params.creatorAddress,
            });

            if (!error) {
              response_data.push(data);
            } else {
              // error = error;
            }
          } catch (error) {
            console.log(error);
            return NextResponse.json(
              { error: "Internal Server Error" },
              { status: 500 }
            );
          }
      }
    }

    if (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
    console.log(response_data);
    return NextResponse.json({ data: response_data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
