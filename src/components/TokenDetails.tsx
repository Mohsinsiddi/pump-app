import React from "react";
import BuySellToken from "./BuySellToken";
import TokenInfo from "./TokenInfo";
import { TokenDataType } from "@/types/db.types";
import { convertToOHLC } from "@/util/chart-data/convertToOHLC";
import TradingChart from "./TradingChart";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SCALE } from "@/util/solana/priceHelper";
import { FetchTokenDataResponse, WishlistType } from "@/action/type/type";

type DataInterface = {
  data: FetchTokenDataResponse;
  wishlistData: WishlistType | null;
};

export default async function TokenDetails({
  data,
  wishlistData,
}: DataInterface) {
  const interval = 300 * 1000;
  const dataParsed = convertToOHLC(data.trades, interval);

  const txID =
    "2zdujLsaQ2kjtKFKqrWKG11x82j2zeUaJq6itgdnyuREY7QBRLCug38bHN5BiaBiJbSFsCECfLaQtT5x1GsDg1UC";
  const topHolderDetails: { owner: string; balance: number }[] = [];
  const parseTransaction = async () => {
    const rpcConnection = new Connection("https://api.devnet.solana.com");
    const info = await rpcConnection.getTransaction(txID, {
      maxSupportedTransactionVersion: 0,
    });
    let accs = info?.transaction.message.getAccountKeys(); // get all accs of all ixs
    console.log(accs?.staticAccountKeys);

    for (let inner_ixs of info?.meta?.innerInstructions!) {
      console.log(inner_ixs);
      let first_ix = inner_ixs.instructions[0]; // ix of interest
      console.log(first_ix.programIdIndex);
      let program_id =
        accs?.staticAccountKeys[first_ix.programIdIndex - 1].toString();
      console.log(program_id);
    }

    const required_log_message = info?.meta?.logMessages![6];
    const splitted_log_message = required_log_message?.split(" ");
    const token_price = splitted_log_message![5];
    const price_in_sol = parseInt(token_price);
    console.log(price_in_sol / LAMPORTS_PER_SOL / SCALE);

    const largestTokenAccounts = await rpcConnection.getTokenLargestAccounts(
      new PublicKey(data.token_data.id)
    );
    console.log(largestTokenAccounts.value);

    for (var i = 0; i < largestTokenAccounts.value.length && i < 10; i++) {
      const accountInfo: any = await rpcConnection.getParsedAccountInfo(
        largestTokenAccounts.value[i].address
      );

      if (!accountInfo) {
        return;
      }

      topHolderDetails.push({
        owner: accountInfo.value?.data?.parsed.info.owner!,
        balance: largestTokenAccounts?.value[i]?.uiAmount!,
      });
    }

    console.log("Top Holder info", topHolderDetails);
  };
  //  parseTransaction();

  const rpcConnection = new Connection("https://api.devnet.solana.com");

  const largestTokenAccounts = await rpcConnection.getTokenLargestAccounts(
    new PublicKey(data.token_data.id)
  );

  for (var i = 0; i < largestTokenAccounts.value.length && i < 10; i++) {
    const accountInfo: any = await rpcConnection.getParsedAccountInfo(
      largestTokenAccounts.value[i].address
    );

    if (!accountInfo) {
      return;
    }

    topHolderDetails.push({
      owner: accountInfo.value?.data?.parsed.info.owner!,
      balance: largestTokenAccounts?.value[i]?.uiAmount!,
    });
  }

  return (
    <div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row justify-around">
        <TokenInfo
          data={data.token_data}
          topHolderDetails={topHolderDetails}
          wishlist_count={data.wishlist_count}
          trade_count={data.trade_count}
          wishlistData={wishlistData}
        />
        <BuySellToken data={data.token_data} />
      </div>
      {dataParsed && (
        <div>
          <TradingChart data={dataParsed} />
        </div>
      )}
    </div>
  );
}
