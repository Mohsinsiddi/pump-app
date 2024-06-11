"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { TokenDataType } from "@/types/db.types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { getUserTokenBalance } from "@/util/solana/getTokenBalance";
import { buyTokenOnSolana } from "@/lib/smart-contract/solana/instructions/buyTokens";
import { sellTokenOnSolana } from "@/lib/smart-contract/solana/instructions/sellTokens";
import { toast, ExternalToast } from "sonner";
import { TradeTokensDialog } from "./TradeTokensDialog";
import useStore from "@/app/store/useStore";
import { decodeTxSignature } from "@/util/solana/decoder/txDecoder";
import axios, { AxiosError } from "axios";
import { getTokenPrice } from "@/util/solana/getTokenPrice";
import { TokenData } from "@/action/type/type";

type DataInterface = {
  data: TokenData;
};

export default function BuySellToken({ data }: DataInterface) {
  const { isTrading, setIsTradingFlag } = useStore();
  const [inputSol, setInputSol] = useState(0);
  const [inputAmount, setInputAmount] = useState(0);

  const [action, setAction] = useState("buy_tokens");

  const [solBalance, setSolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState("0.0000");
  const tokenImage = data.image;
  const sol_logo =
    "https://logos-world.net/wp-content/uploads/2024/01/Solana-Logo.png";

  const token_mint = data.id;

  const connection = useConnection();
  const wallet = useWallet();

  const fetchWalletBalances = async () => {
    const balance = await connection.connection.getBalance(wallet.publicKey!);

    setSolBalance(balance / LAMPORTS_PER_SOL);

    const mint = await getMint(connection.connection, new PublicKey(data.id));

    console.log(mint.supply.toString());
    console.log(parseInt(mint.supply.toString()));

    const token_price = getTokenPrice(parseInt(mint.supply.toString()));
    const token_price1 = getTokenPrice(1000000000000000);

    console.log(token_price / LAMPORTS_PER_SOL);
    console.log(token_price1 / LAMPORTS_PER_SOL);

    const user_ata = getAssociatedTokenAddressSync(
      new PublicKey(token_mint),
      wallet.publicKey!
    );

    const tokenBalance = await getUserTokenBalance(
      connection.connection,
      user_ata
    );
    console.log(tokenBalance?.toString());
    if (!tokenBalance) {
      setTokenBalance("0.00000");
    } else {
      setTokenBalance(tokenBalance?.toString()!);
    }
  };

  const refreshStates = () => {
    setInputSol(0);
    setInputAmount(0);
  };

  useEffect(() => {
    if (wallet.publicKey && wallet.connected) {
      fetchWalletBalances();
    }
  }, [wallet.publicKey]);

  return (
    <div>
      <TradeTokensDialog
        action={action}
        amount={
          action === "buy_tokens" ? inputSol.toString() : inputAmount.toString()
        }
        inputSol={inputSol}
        inputAmount={inputAmount}
        slippage={10}
        token_image={tokenImage}
        token_name={data.name}
        token_symbol={data.symbol}
        key={data.id}
        total_minted_supply={56789900000000}
        fetchWalletBalances={fetchWalletBalances}
        token_mint={token_mint}
        owner={data.owner}
        refreshStates={refreshStates}
      />
      <Tabs defaultValue="buy" className="w-[328px]">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger
            value="buy"
            className=""
            onClick={() => setAction("buy_tokens")}
          >
            BUY
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className=""
            onClick={() => setAction("sell_tokens")}
          >
            SELL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <Card className="bg-[#070815]">
            <CardHeader>
              <CardTitle>Buy {data.symbol.toUpperCase()}</CardTitle>
              <CardDescription className="text-white font-extrabold text-xl font-mono">
                {` Buy Tokens with SOL`.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-white">
                  {`SOL Amount : ${solBalance.toFixed(4)}`}
                </Label>

                <div className="relative w-full">
                  <Input
                    id="sol_value"
                    defaultValue="0.0"
                    className="bg-slate-800 text-white"
                    value={inputSol}
                    //@ts-ignore
                    onChange={(e) => setInputSol(e.target.value)}
                  />
                  <div className="flex absolute right-0 top-0 m-2 h-6 w-6 text-muted-foreground">
                    <Image
                      alt="sol-nft-image"
                      fill
                      sizes="100%"
                      src={sol_logo}
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="">
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputSol(0)}
                  >
                    RESET
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputSol(1)}
                  >
                    1 SOL
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputSol(5)}
                  >
                    5 SOL
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputSol(10)}
                  >
                    10 SOL
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsTradingFlag(true)}>
                BUY {data.symbol.toLocaleUpperCase()}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sell">
          <Card className="bg-[#070815]">
            <CardHeader>
              <CardTitle>Sell {data.symbol.toLocaleUpperCase()}</CardTitle>
              <CardDescription className="text-white font-extrabold text-xl font-mono">
                {` Sell Tokens for SOL`.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      {`${data.symbol} Amount : ${tokenBalance}`}
                    </Label>
                  </div>
                </div>
                <div className="relative w-full">
                  <Input
                    id="token_value"
                    defaultValue="0.0"
                    className="bg-slate-800 text-white"
                    value={inputAmount}
                    //@ts-ignore
                    onChange={(e) => setInputAmount(e.target.value)}
                  />
                  <div className="flex absolute right-0 top-0 m-2 h-6 w-6 text-muted-foreground">
                    <Image
                      alt="sol-nft-image"
                      fill
                      sizes="100%"
                      src={tokenImage}
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="">
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputAmount(0)}
                  >
                    RESET
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() =>
                      setInputAmount(0.25 * parseFloat(tokenBalance))
                    }
                  >
                    25%
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() =>
                      setInputAmount(0.5 * parseFloat(tokenBalance))
                    }
                  >
                    50%
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputAmount(parseFloat(tokenBalance))}
                  >
                    100%
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsTradingFlag(true)}>
                SELL {data.symbol.toLocaleUpperCase()}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
