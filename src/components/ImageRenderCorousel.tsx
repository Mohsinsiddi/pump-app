"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ProgressBarBondingCurve } from "./ProgressBarBondingCurve";
import { Label } from "@radix-ui/react-label";
import { BiLogoTelegram } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoDiscord } from "react-icons/io5";
import { TbWorldWww } from "react-icons/tb";
import { FaRegKissWinkHeart } from "react-icons/fa";
import { FcGlobe } from "react-icons/fc";
import {
  HighlightedTokenData,
  TokenDataTypeWithTrades,
} from "@/types/db.types";
import CountdownTimer from "./CountDownTimer";
import { useConnection } from "@solana/wallet-adapter-react";

interface ImageRenderProps {
  imageUrl: string;
  callBackImageUrl: string;
  data: HighlightedTokenData;
  position: string;
  ends_in: number;
}

const ImageRenderCurousel: React.FC<ImageRenderProps> = ({
  imageUrl,
  callBackImageUrl,
  data,
  position,
  ends_in,
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const name = data.name;
  const symbol = data.symbol;
  const description = data.description;
  const owner = data.owner;

  const connection = useConnection();
  return (
    <div className="relative w-full h-full">
      <Image
        alt="sol-nft-image"
        fill
        sizes="100%"
        src={imageUrl}
        className="object-cover rounded-md"
        onError={() => {
          setImgSrc(callBackImageUrl);
        }}
      />
      <div className="absolute bottom-0 px-2 py-2 bg-gray-500/50 w-full">
        <div className="flex justify-between">
          <div>
            {" "}
            <h1 className=" font-semibold text-md md:text-2xl">{`${name}(${symbol})`}</h1>
          </div>
          <div>
            <CountdownTimer deadline={new Date(ends_in)} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex font-mono text-xs md:text-lg">
            <p className="">Creator:</p>
            <p>{owner.slice(0, 10)}</p>
          </div>
          <div className="text-xs md:text-lg">Market Ca : 100k $</div>
          <div className="flex flex-col gap-1">
            <ProgressBarBondingCurve total_supply={1000000} h="4" />
          </div>
          <div className="flex gap-x-1 md:gap-x-2 m-[2px] md:m-1">
            <div>
              <TbWorldWww size={20} />
            </div>
            <div>
              <FaXTwitter size={20} />
            </div>
            <div>
              <BiLogoTelegram size={20} />
            </div>
            <div>
              <IoLogoDiscord size={20} />
            </div>
            <div>
              <Image
                src={
                  "https://res.cloudinary.com/alchemy-website/image/upload/v1694675795/dapp-store/dapp-logos/Solscan.png"
                }
                alt=""
                height={20}
                width={20}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex text-xs md:text-lg gap-x-2">
          <div className="flex space-x-2 ">
            <div>
              <FcGlobe size={24} className="mt-[2px]" />
            </div>
            <div className="text-xs md:text-lg font-mono font-semibold">
              {data.views}
            </div>
          </div>
          <div>|</div>
          <div className="flex space-x-2 ">
            <div>
              <FaRegKissWinkHeart size={24} color="red" className="mt-[2px]" />
            </div>
            <div className="text-xs md:text-lg font-mono font-semibold">
              {data.wishlist_count}
            </div>
          </div>
          <div>|</div>

          <div className="flex text-xs md:text-lg font-mono font-semibold">
            <div>Trades:</div>
            <div>{data.trade_count}</div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 bg-green-600 font-extrabold text-black font-mono p-2 text-xs md:text-lg rounded-br-lg">
        H.Rank: {position}
      </div>
    </div>
  );
};
export default ImageRenderCurousel;
