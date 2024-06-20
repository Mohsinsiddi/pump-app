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

import { TradeTokensDialog } from "./TradeTokensDialog";
import useStore from "@/app/store/useStore";
import { decodeTxSignature } from "@/util/solana/decoder/txDecoder";
import axios, { AxiosError } from "axios";
import { getTokenPrice } from "@/util/solana/getTokenPrice";
import { TokenData } from "@/action/type/type";
import { Separator } from "./ui/separator";
import { LockedTokenAccountTyp } from "@/types/solanaTypes";
import { toast as sonnerTasot, ExternalToast } from "sonner";
import { lockPlatformTokens } from "@/lib/smart-contract/solana/instructions/lockTokens";
import { PLATFORM_TOKEN } from "@/lib/smart-contract/solana/constants";
import { unlockPlatformTokens } from "@/lib/smart-contract/solana/instructions/unlockTokens";
import CountdownTimer from "./CountDownTimer";

interface LockingOption {
  type: number;
  days: number;
  multiplier: number;
  account_data: LockedTokenAccountTyp | null;
}

interface LockingCardProps {
  option: LockingOption;
  tokenBalance: number;
}

export default function LockUnlockTokensToken({
  option,
  tokenBalance,
}: LockingCardProps) {
  const isAccountExist = option.account_data ? true : false;
  const { isTrading, setIsTradingFlag } = useStore();
  const [inputLockAccount, setInputLockAmount] = useState(0);
  const [inputUnlockAmount, setInputUnlockAmount] = useState(0);

  const [action, setAction] = useState("lock_tokens");

  const tokenImage =
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";

  const connection = useConnection();
  const wallet = useWallet();

  const isUnlocked =
    new Date().getTime() > new Date(option.account_data?.end_time!).getTime();

  const lockTokens = async () => {
    try {
      if (inputLockAccount === 0) {
        sonnerTasot.error(`Please Enter Value greater than 0`, {
          duration: 5000,
          className: "z-20",
        });
        return;
      }
      const { txHash } = await lockPlatformTokens(
        connection.connection,
        wallet,
        PLATFORM_TOKEN,
        inputLockAccount,
        option.type.toString()
      );

      if (txHash) {
        sonnerTasot.success(`Tokens Locked Successfully`, {
          duration: 10000,
          action: {
            label: "View Tx",
            onClick: () =>
              window.open(
                `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
          className: "z-20",
        });
      }
    } catch (error) {
      console.log(error);
      sonnerTasot.error(`Error while locking tokens`, {
        duration: 5000,
        className: "z-20",
      });
    }
  };
  const unlockTokens = async () => {
    try {
      if (inputUnlockAmount === 0) {
        sonnerTasot.error(`Please Enter Value greater than 0`, {
          duration: 5000,
          className: "z-20",
        });
        return;
      }
      const { txHash } = await unlockPlatformTokens(
        connection.connection,
        wallet,
        PLATFORM_TOKEN,
        inputUnlockAmount,
        option.type.toString()
      );

      if (txHash) {
        sonnerTasot.success(`Tokens UnLocked Successfully`, {
          duration: 10000,
          action: {
            label: "View Tx",
            onClick: () =>
              window.open(
                `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
          className: "z-20",
        });
      }
    } catch (error) {
      console.log(error);
      sonnerTasot.error(`Error while locking tokens`, {
        duration: 5000,
        className: "z-20",
      });
    }
  };

  const data = {
    name: " Mohsin",
    symbol: "MOH",
  };

  return (
    <div>
      <Tabs defaultValue="buy" className="w-[328px]">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger
            value="buy"
            className=""
            onClick={() => setAction("lock_tokens")}
          >
            LOCK
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className=""
            onClick={() => setAction("unlock_tokens")}
          >
            UNLOCK
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <Card className="bg-[#070815]">
            <CardHeader className=" border-[1px] border-slate-500 rounded-md ">
              <CardDescription className="flex justify-center text-white font-extrabold text-sm font-mono">
                {` LOCK Tokens for REV-SHARE`.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2">
              <div className="flex flex-col justify-center items-center text-white border-[1px] border-slate-500 rounded-md p-2">
                <div className="">{`Reward Multiplier:${option.multiplier}x`}</div>
                <div className="">{`Locking Period:${option.days} days`}</div>
              </div>
              {isAccountExist && (
                <div>
                  <Separator />
                  <div className="flex flex-col justify-center items-center text-white font-mono text-sm">
                    <div className="font-mono">LOCK ACCOUNT DATA</div>
                    <div className="flex justify-between w-full">
                      <div>Amount:</div>
                      <div className="">
                        {option.account_data?.amount! / 10 ** 6}
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Lock type:</div>
                      <div className="">{option.account_data?.lock_type}</div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Reward Multiplier:</div>
                      <div className="">
                        {option.account_data?.reward_multiplier}
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Expected Revenue:</div>
                      <div className="">{`${2} SOL`}</div>
                    </div>

                    {!isUnlocked ? (
                      <div className="flex justify-between w-full">
                        <div>Ends in:</div>
                        <div className="">
                          <CountdownTimer
                            deadline={
                              new Date(option.account_data?.end_time! * 1000)
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-500 p-1 rounded-lg">
                        LOCKING PERIOD ENDED
                      </div>
                    )}
                  </div>
                  <Separator />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="name" className="text-white">
                  {`Wallet Amount : ${tokenBalance.toFixed(4)}`}
                </Label>

                <div className="relative w-full">
                  <Input
                    id="sol_value"
                    defaultValue="0.0"
                    className="bg-slate-800 text-white"
                    value={inputLockAccount}
                    //@ts-ignore
                    onChange={(e) => setInputLockAmount(e.target.value)}
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
                    onClick={() => setInputLockAmount(0)}
                  >
                    RESET
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputLockAmount(0.25 * tokenBalance)}
                  >
                    25%
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputLockAmount(0.5 * tokenBalance)}
                  >
                    50%
                  </Button>
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => setInputLockAmount(tokenBalance)}
                  >
                    100%
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={lockTokens}
                disabled={isAccountExist}
              >
                LOCK {data.symbol.toLocaleUpperCase()}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sell">
          <Card className="bg-[#070815]">
            <CardHeader className=" border-[1px] border-slate-500 rounded-md">
              <CardDescription className=" flex justify-center items-center text-white font-extrabold text-sm font-mono">
                {` Unlock Tokens`.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2">
              <div className="flex flex-col justify-center items-center text-white border-[1px] border-slate-500 rounded-md p-2">
                <div className="">{`Reward Multiplier:${option.multiplier}x`}</div>
                <div className="">{`Locking Period:${option.days} days`}</div>
              </div>
              {isAccountExist && (
                <div>
                  <Separator />
                  <div className="flex flex-col justify-center items-center text-white font-mono text-sm">
                    <div className="font-mono">LOCK ACCOUNT DATA</div>
                    <div className="flex justify-between w-full">
                      <div>Amount:</div>
                      <div className="">
                        {option.account_data?.amount! / 10 ** 6}
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Lock type:</div>
                      <div className="">{option.account_data?.lock_type}</div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Reward Multiplier:</div>
                      <div className="">
                        {option.account_data?.reward_multiplier}
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>Expected Revenue:</div>
                      <div className="">{`${2} SOL`}</div>
                    </div>

                    {!isUnlocked ? (
                      <div className="flex justify-between w-full">
                        <div>Ends in:</div>
                        <div className="">
                          <CountdownTimer
                            deadline={
                              new Date(option.account_data?.end_time! * 1000)
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-500 p-1 rounded-lg">
                        LOCKING PERIOD ENDED
                      </div>
                    )}
                  </div>
                  <Separator />
                </div>
              )}
              <div className="space-y-1">
                <div className="">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      {`Locked Amount : ${
                        (option.account_data?.amount! / 10 ** 6) | 0
                      }`}
                    </Label>
                  </div>
                </div>
                <div className="relative w-full">
                  <Input
                    id="token_value"
                    defaultValue="0.0"
                    className="bg-slate-800 text-white"
                    value={inputUnlockAmount}
                    //@ts-ignore
                    onChange={(e) => setInputUnlockAmount(e.target.value)}
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
                <div className="flex justify-end">
                  <Button
                    className="bg-[#25294a] text-xs h-8"
                    onClick={() => {
                      setInputUnlockAmount(
                        option.account_data?.amount! / 10 ** 6
                      );
                    }}
                    disabled={!option.account_data}
                  >
                    100%
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={unlockTokens}
                disabled={!isAccountExist && isUnlocked}
              >
                UNLOCK {data.symbol.toLocaleUpperCase()}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
