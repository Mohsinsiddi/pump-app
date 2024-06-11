"use client";
import React from "react";

import Image from "next/image";

import useStore from "@/app/store/useStore";
import { ExploreTokenDataType } from "@/types/db.types";
import { useRouter } from "next/navigation";
import ToolTipRenderer from "./ToolTipRenderer";
import { FcGlobe } from "react-icons/fc";
import { ProgressBarBondingCurve } from "./ProgressBarBondingCurve";
import { FaRegKissWinkHeart } from "react-icons/fa";
import { RiSwapBoxFill } from "react-icons/ri";

interface TokenCardProps {
  data: ExploreTokenDataType;
}

export default function TokenCard({ data }: TokenCardProps) {
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
          <div className="flex justify-center items-center">
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
          <div className="flex flex-col justify-between space-y-[1px]">
            <ToolTipRenderer message={`${data.name}`}>
              <div className="truncate w-full text-orange-300">
                {`${data.name.slice(0, 10)}(${data.symbol})`}
              </div>
            </ToolTipRenderer>

            <div className="flex font-mono text-xs">
              <p>Creator:</p>
              <p>{data.owner.slice(0, 10)}</p>
            </div>
            <div className="text-xs">M.C.: 100k $</div>

            <div className="">
              <ProgressBarBondingCurve
                total_supply={data.total_supply / 1e6}
                h="2"
              />
            </div>

            <div className="flex flex-wrap space-x-1 ">
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
              <ToolTipRenderer message={`Solscan Token URL`}>
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
              </ToolTipRenderer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
