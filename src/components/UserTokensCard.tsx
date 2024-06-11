"use client";
import React, { useEffect, useState } from "react";
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
import { useWallet } from "@solana/wallet-adapter-react";
import { createToken, fetchToken } from "@/action/tokens";
import { createTrade, fetchTrades } from "@/action/trades";
import useStore from "@/app/store/useStore";
import { TokenDataTypeWithTrades } from "@/types/db.types";
import { useRouter } from "next/navigation";
import { RenderData } from "@/types/solanaTypes";
import ToolTipRenderer from "./ToolTipRenderer";
import axios from "axios";
import clsx from "clsx";
import { toast as sonnerToasot, ExternalToast } from "sonner";

interface TokenCardProps {
  data: RenderData;
}

export default function UserTokensCard({ data }: TokenCardProps) {
  const router = useRouter();

  if (!data.isFullyFetched) {
    return null; // Or some other placeholder or loading state
  }

  return (
    <div
      className="w-[260px] md:w-[236px] relative transition-transform transform hover:scale-105 duration-300 ease-in-out hover:cursor-pointer"
      onClick={() => {
        if (data.isPlatformLaunched) {
          router.push(`/token-details/${data.mint}`);
        } else {
          sonnerToasot.error(`Token hasn't being launched on Syphon`, {
            duration: 2000,
            className: "z-20",
          });
        }
      }}
    >
      <div className="glass-container row-span-3 grid grid-rows-subgrid rounded-lg bg-gradient-to-b from-gray-900 to-gray-950 p-[2px]">
        <div className="flex">
          <div>
            <div className="relative w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24">
              {data.image && (
                <Image
                  alt="sol-nft-image"
                  fill
                  sizes="100%"
                  src={data.image}
                  className="object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <div className="">
            <div>
              <div className="text-xs">{`${data.name?.slice(0, 12)}(${
                data.symbol
              })`}</div>
            </div>
            <div>
              <div className="text-xs">{`Bal:${data.amount}`}</div>
            </div>
            <div>
              <div className="text-xs">{`Decimal:${data.decimal}`}</div>
            </div>

            <div className="">
              <ToolTipRenderer message={`Solcan Token URL`}>
                <div>
                  <Image
                    src={
                      "https://res.cloudinary.com/alchemy-website/image/upload/v1694675795/dapp-store/dapp-logos/Solscan.png"
                    }
                    alt=""
                    height={20}
                    width={20}
                    className="rounded-md cursor-pointer"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/token/${data.mint}?cluster=devnet`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  />
                </div>
              </ToolTipRenderer>
            </div>
          </div>
        </div>
      </div>
      <ToolTipRenderer
        message={`${
          data.isPlatformLaunched
            ? "Token Launched on Syphon"
            : "Not Launched on Syphon"
        }`}
      >
        <div
          className={clsx(
            "absolute bottom-0 right-0 font-extrabold text-black font-mono p-1 text-xs rounded-br-lg",
            data.isPlatformLaunched ? "bg-green-600" : "bg-orange-600"
          )}
        >
          {data.isPlatformLaunched ? " Syph" : "non-Syph"}
        </div>
      </ToolTipRenderer>
    </div>
  );
}
