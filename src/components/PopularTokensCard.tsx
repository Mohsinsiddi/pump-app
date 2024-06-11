"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { createUser, fetchUser } from "@/action/users";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createToken, fetchToken } from "@/action/tokens";
import { createTrade, fetchTrades } from "@/action/trades";
import useStore from "@/app/store/useStore";
import {
  PopularTokenDataType,
  TokenDataTypeWithMostTrades,
  TokenDataTypeWithTrades,
} from "@/types/db.types";
import { useRouter } from "next/navigation";
import ToolTipRenderer from "./ToolTipRenderer";
import { RiSwapBoxFill } from "react-icons/ri";
import { ProgressBarBondingCurve } from "./ProgressBarBondingCurve";
import { FcGlobe } from "react-icons/fc";
import { FaRegKissWinkHeart } from "react-icons/fa";

interface TokenCardProps {
  data: PopularTokenDataType;
}

export default function PopularTokenCard({ data }: TokenCardProps) {
  const { connection } = useConnection();

  const router = useRouter();

  return (
    <div
      className="w-[260px] md:w-[236px] relative transition-transform transform hover:scale-105 duration-300 ease-in-out hover:cursor-pointer"
      onClick={() => {
        router.push(`/token-details/${data.id}`);
      }}
    >
      <div className="glass-container row-span-3 grid grid-rows-subgrid rounded-lg bg-gradient-to-b from-gray-900 to-gray-950 p-[2px]">
        <div className="flex">
          <div>
            <div className="relative w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24">
              <Image
                alt="sol-nft-image"
                fill
                sizes="100%"
                src={data.image}
                className="object-cover rounded-md"
              />
            </div>
          </div>
          <div>
            <div>{data.name}</div>
            <div className="flex font-mono text-xs">
              <p>Creator:</p>
              <p>{data.owner.slice(0, 10)}</p>
            </div>
            <div className="text-xs">M.C.: 100k $</div>
            <div>
              <div className="flex flex-col gap-1">
                <ProgressBarBondingCurve
                  total_supply={10000000000000 / 1e6}
                  h="2"
                />
              </div>
            </div>
            <div className="flex space-x-1">
              <div className="flex space-x-1 cursor-pointer">
                <div>
                  <ToolTipRenderer message={`Total Trades of this Token`}>
                    <div>
                      <RiSwapBoxFill size={20} className="" />
                    </div>
                  </ToolTipRenderer>
                </div>
                <div className="text-xs font-mono font-semibold mt-[2px]">
                  {data.trade_count}
                </div>
              </div>
              <div className="flex space-x-1 cursor-pointer">
                <ToolTipRenderer message={`Total Token Views`}>
                  <div className="flex">
                    <FcGlobe size={20} />
                    <div className="text-xs font-mono font-semibold mt-[2px]">
                      {data.views}
                    </div>
                  </div>
                </ToolTipRenderer>
              </div>
              <div className="flex space-x-1 cursor-pointer hover:bg-slate-800 rounded-sm">
                <ToolTipRenderer message={`Token Wishlist Count`}>
                  <div>
                    <FaRegKissWinkHeart
                      size={18}
                      color={"green"}
                      className=""
                    />
                  </div>
                </ToolTipRenderer>
                <div className="text-xs font-mono font-semibold mt-[2px]">
                  {data.wishlist_count}
                </div>
              </div>
              <div className="">
                <ToolTipRenderer message={`Solcan Token URL`}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://solscan.io/token/${data.id}?cluster=devnet`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <Image
                      src={
                        "https://res.cloudinary.com/alchemy-website/image/upload/v1694675795/dapp-store/dapp-logos/Solscan.png"
                      }
                      alt=""
                      height={18}
                      width={18}
                      className="rounded-md"
                    />
                  </div>
                </ToolTipRenderer>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
