"use client";
import useStore from "@/app/store/useStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import ImageRender from "./ImageRender";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { BiLogoTelegram } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoDiscord } from "react-icons/io5";
import { TbWorldWww } from "react-icons/tb";
import { createTokenOnSolana } from "@/lib/smart-contract/solana/instructions/createToken";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { GLOBAL_DECIMAL } from "@/lib/smart-contract/solana/constants";
import axios from "axios";
import { toast as sonnerTasot, ExternalToast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getHighlightingPriceHelper } from "@/util/solana/getHighlightingPriceHelper";

export function ProcessDialog() {
  const [loading, setLoading] = useState(false);
  const [SOLBuyAmount, setSOLBuyAmount] = useState(0);
  const connection = useConnection();
  const wallet = useWallet();
  const {
    createTokenProgressbarFlag,
    resetCreateTokenProgressbarFlag,
    createTokenData,
  } = useStore();

  const router = useRouter();

  const data = createTokenData.formData;

  const twitter: String | null = data?.get("twitter") as unknown as String;
  const discord: String | null = data?.get("discord") as unknown as String;
  const telegram: String | null = data?.get("telegram") as unknown as String;
  const website: String | null = data?.get("website") as unknown as String;

  const createTokenHandler = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload-metadata", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      const metadataURI = `https://gateway.pinata.cloud/ipfs/${resData.ipfsHash}`;
      const { txHash, mint } = await createTokenOnSolana(
        connection.connection,
        wallet,
        createTokenData.name,
        createTokenData.symbol,
        metadataURI,
        GLOBAL_DECIMAL,
        SOLBuyAmount,
        createTokenData.highlight_token_config,
        createTokenData.desired_position,
        createTokenData.desired_number_hours
      );

      const response = await axios.post("/api/decode-signature", {
        txHash: txHash,
      });
      if (response.data) {
        await new Promise((f) => setTimeout(f, 10 * 1000));
        sonnerTasot.success(`Tokens Created Successfully`, {
          duration: 10000,
          action: {
            label: "View Token Mint",
            onClick: () =>
              window.open(
                `https://explorer.solana.com/address/${mint}?cluster=devnet`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
          className: "z-20",
        });

        router.push(`/token-details/${mint}`);
      }
    } catch (error: any) {
      console.log(JSON.stringify(error.logs));
      sonnerTasot.error(`Error while creating token`, {
        duration: 10000,
        className: "z-20",
      });
    } finally {
      setLoading(false);
      resetCreateTokenProgressbarFlag();
    }
  };

  return (
    <AlertDialog open={createTokenProgressbarFlag}>
      <AlertDialogContent className="bg-[#070815] md:w-[425px] rounded-xl">
        <div className="gap-y-1">
          {" "}
          <div className="flex justify-center">
            <ImageRender
              imageUrl={createTokenData.image}
              callBackImageUrl={""}
            />
          </div>
          <div className="flex justify-center text-lg font-mono font-extrabold">{`${createTokenData.name}(${createTokenData.symbol})`}</div>
          <Separator />
          <div className="flex justify-center text-xs font-mono mb-1">{`${(
            <p className="font-semibold">Description</p>
          )}:${createTokenData.description}`}</div>
          <Separator />
          <div>
            <div className="flex font-mono  gap-x-2">
              <div className="">Desired Highlights Rank: </div>
              <div>{createTokenData.desired_position}</div>
            </div>
            <div className="flex font-mono  gap-x-2">
              <div>Highlights Duration: </div>
              <div>{createTokenData.desired_number_hours}</div>
            </div>
            <div className="flex font-mono  gap-x-2">
              <div>{`Position ${
                createTokenData.desired_position
              } waiting period: ${100} hours(${36} tokens)`}</div>
            </div>
            <div className="flex font-mono font-extrabold gap-x-2">
              <div>Total Highlighting Cost: </div>
              <div>{`${createTokenData.total_cost.toFixed(4)} SOL`}</div>
            </div>
          </div>
          <Separator />
          <div className="flex my-1">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label
                htmlFor="buy_amount"
                className="text-md font-mono font-medium"
              >
                SOL to buy at mint(optional)
              </Label>
              <Input
                type="buy_amount"
                id="buy_amount"
                placeholder="SOL Amount"
                value={SOLBuyAmount}
                //@ts-ignore
                onChange={(e) => setSOLBuyAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 my-1">
            {" "}
            {website && (
              <div className="flex">
                <div className="pt-[2px]">
                  <TbWorldWww size={18} />
                </div>
                <div>{website}</div>
              </div>
            )}
            {twitter && (
              <div className="flex">
                <div className="pt-[2px]">
                  <FaXTwitter size={18} />
                </div>
                <div>{twitter}</div>
              </div>
            )}
            {telegram && (
              <div className="flex">
                <div className="pt-[2px]">
                  <BiLogoTelegram size={18} />
                </div>
                <div>{telegram}</div>
              </div>
            )}
            {discord && (
              <div className="flex">
                <div className="pt-[2px]">
                  <IoLogoDiscord size={18} />
                </div>
                <div>{discord}</div>
              </div>
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={resetCreateTokenProgressbarFlag}
            className="text-black"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={createTokenHandler}>
            {!loading ? (
              <div>Confirm</div>
            ) : (
              <Loader2 className="ml-2 h-6 w-6 animate-spin" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
