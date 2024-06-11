"use client";
import React, { useEffect, useState } from "react";
import ImageRender from "./ImageRender";
import { ProgressBarBondingCurve } from "./ProgressBarBondingCurve";
import { Label } from "./ui/label";
import HolderDistribution from "./HolderDistribution";
import { FaXTwitter } from "react-icons/fa6";
import { BiLogoTelegram } from "react-icons/bi";
import { IoLogoDiscord } from "react-icons/io5";
import { TbWorldWww } from "react-icons/tb";

import { TokenDataType } from "@/types/db.types";
import { TokenData, WishlistType } from "@/action/type/type";
import { FaRegKissWinkHeart } from "react-icons/fa";
import { FcGlobe } from "react-icons/fc";
import { MdSwapHorizontalCircle } from "react-icons/md";
import { RiSwapBoxFill } from "react-icons/ri";
import { Button } from "./ui/button";
import axios from "axios";
import clsx from "clsx";
import { toast as sonnerTasot, ExternalToast } from "sonner";
import { debounceFunction } from "@/util/debounce";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ToolTipRenderer from "./ToolTipRenderer";
import Image from "next/image";
import { useConnection } from "@solana/wallet-adapter-react";

type DataInterface = {
  data: TokenData;
  topHolderDetails: { owner: string; balance: number }[];
  wishlist_count: number;
  trade_count: number;
  wishlistData: WishlistType | null;
};

export default function TokenInfo({
  data,
  topHolderDetails,
  wishlist_count,
  trade_count,
  wishlistData,
}: DataInterface) {
  const [isWished, setIsWished] = useState<boolean>(
    wishlistData ? true : false
  );
  const [wish_count, setWishCount] = useState(wishlist_count);

  const [twitter, setTwitter] = useState<string | null>(null);
  const [discord, setDiscord] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [telegram, setTelegram] = useState<string | null>(null);

  const addToWishlistHandler = async () => {
    try {
      const response = await axios.post(`/api/add-to-wishlist`, {
        token_id: data.id,
      });
      setIsWished(true);

      sonnerTasot.success(`Token Wishlisted Successfully`, {
        duration: 2000,
        className: "z-20",
      });
      setWishCount((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      sonnerTasot.error(`Eror while token wishlisting`, {
        duration: 2000,
        className: "z-20",
      });
    }
  };

  const removeFromWishlistHandler = async () => {
    try {
      const response = await axios.post(`/api/remove-from-wishlist`, {
        token_id: data.id,
      });
      setIsWished(false);

      sonnerTasot.success(`Token UnWishlisted Successfully`, {
        duration: 2000,

        className: "z-20",
      });
      setWishCount((prev) => prev - 1);
    } catch (error) {
      console.log(error);
      sonnerTasot.error(`Eror while token unwishlisting`, {
        duration: 2000,

        className: "z-20",
      });
    }
  };

  const connection = useConnection();

  useEffect(() => {
    async function fetchMetadata() {
      const token_metadata_response = await axios.get(data.metadata_uri);
      const metadata_data = token_metadata_response.data;
      if (metadata_data.twitter) {
        setTwitter(metadata_data.twitter);
      }
      if (metadata_data.discord) {
        setDiscord(metadata_data.discord);
      }
      if (metadata_data.telegram) {
        setTelegram(metadata_data.telegram);
      }
      if (metadata_data.website) {
        setWebsite(metadata_data.website);
      }
    }
    fetchMetadata();
  }, []);

  return (
    <div className=" flex flex-col">
      <div className="sm:flex">
        <div className="flex justify-center items-center">
          <ImageRender imageUrl={data.image} callBackImageUrl="" />
        </div>
        <div>
          <div className="flex">
            <div>{data.name}</div>
            <div>{`(${data.symbol})`}</div>
          </div>
          <div className="flex font-mono text-md">
            <p className="">Creator:</p>
            <p>{data.owner.slice(1, 10)}</p>
          </div>
          <div>Market Ca : 100k $</div>
          <div className="flex flex-col gap-2">
            <ProgressBarBondingCurve total_supply={1000000} h={"4"} />
          </div>
          <div className="flex gap-x-2 m-2 ">
            {website && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${website}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <ToolTipRenderer message={`Website URL`}>
                  <div>
                    <TbWorldWww size={20} />
                  </div>
                </ToolTipRenderer>
              </div>
            )}
            {twitter && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${twitter}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <ToolTipRenderer message={`Twitter URL`}>
                  <div>
                    <FaXTwitter size={20} />
                  </div>
                </ToolTipRenderer>
              </div>
            )}
            {telegram && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${telegram}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <ToolTipRenderer message={`Telegram URL`}>
                  <div>
                    <BiLogoTelegram size={20} />
                  </div>
                </ToolTipRenderer>{" "}
              </div>
            )}
            {discord && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${discord}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <ToolTipRenderer message={`Discord URL`}>
                  <div>
                    <IoLogoDiscord size={20} />
                  </div>
                </ToolTipRenderer>{" "}
              </div>
            )}
            <div className="cursor-pointer">
              <ToolTipRenderer message={`Solcan Token URL`}>
                <div
                  onClick={() =>
                    window.open(
                      `https://solscan.io/token/${data.id}?cluster=devnet`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
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
              </ToolTipRenderer>{" "}
            </div>
          </div>
          <div className="flex text-xs md:text-lg space-x-2 ">
            <div className="flex space-x-1 cursor-pointer ">
              <div>
                <ToolTipRenderer message={`Total Token Views`}>
                  <div>
                    <FcGlobe size={24} className="mt-[2px]" />
                  </div>
                </ToolTipRenderer>
              </div>
              <div className="text-xs md:text-lg font-mono font-semibold">
                {data.views}
              </div>
            </div>
            <div className="flex space-x-1 cursor-pointer hover:bg-slate-800 rounded-sm">
              <ToolTipRenderer
                message={`${isWished ? "Remove from" : "Add to"} Wishlist`}
              >
                <div
                  onClick={
                    isWished
                      ? debounceFunction(removeFromWishlistHandler, 1000)
                      : debounceFunction(addToWishlistHandler, 1000)
                  }
                >
                  <FaRegKissWinkHeart
                    size={24}
                    color={clsx(isWished ? "red" : "")}
                    className="mt-[2px]"
                  />
                </div>
              </ToolTipRenderer>
              <div className="text-xs md:text-lg font-mono font-semibold">
                {wish_count}
              </div>
            </div>
            <div className="flex space-x-1 cursor-pointer">
              <div>
                <ToolTipRenderer message={`Total Trades of this Token`}>
                  <div>
                    <RiSwapBoxFill size={24} className="mt-[2px]" />
                  </div>
                </ToolTipRenderer>
              </div>
              <div className="text-xs md:text-lg font-mono font-semibold">
                {trade_count}
              </div>
            </div>
          </div>

          <div className="border-sky-100 border-[1px]">
            <p className="text-xs text-balance">
              {`when the market cap reaches $63,730 all the liquidity from the
              bonding curve will be deposited into Raydium and burned.
              progression increases as the price goes up. there are 761,782,030
              tokens still available for sale in the bonding curve and there is
              0.902 SOL in the bonding curve.`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className=" text-xs md:text-md text-balance">{data.description}</p>
      </div>
      <div className="">
        <div>
          <HolderDistribution topHolderDetails={topHolderDetails} />
        </div>
        {/* <div>Charts</div> */}
      </div>
    </div>
  );
}
