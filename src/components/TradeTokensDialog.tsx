import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ImageRender from "./ImageRender";
import { getTokenPrice } from "@/util/solana/getTokenPrice";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast, ExternalToast } from "sonner";
import { buyTokenOnSolana } from "@/lib/smart-contract/solana/instructions/buyTokens";
import { sellTokenOnSolana } from "@/lib/smart-contract/solana/instructions/sellTokens";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

type TradeTokensType = {
  total_minted_supply: number;
  amount: string;
  slippage: number;
  token_name: string;
  token_symbol: string;
  token_image: string;
  action: string;
  fetchWalletBalances: () => Promise<void>;
  token_mint: string;
  inputAmount: number;
  inputSol: number;
  owner: string;
  refreshStates: () => void;
};

export function TradeTokensDialog({
  action,
  amount,
  slippage,
  token_image,
  token_name,
  token_symbol,
  total_minted_supply,
  token_mint,
  fetchWalletBalances,
  inputSol,
  inputAmount,
  owner,
  refreshStates,
}: TradeTokensType) {
  const router = useRouter();
  const connection = useConnection();
  const wallet = useWallet();

  const { isTrading, setIsTradingFlag } = useStore();
  const token_price_without_decimal = getTokenPrice(total_minted_supply);

  const token_price = token_price_without_decimal / LAMPORTS_PER_SOL;

  const [isLoading, setIsloading] = useState(false);

  const buyTokens = async () => {
    if (!wallet.publicKey) {
      toast("Please connect wallet to buy tokens");
      return;
    }
    try {
      setIsloading(true);
      const txHash = await buyTokenOnSolana(
        connection.connection,
        wallet,
        new PublicKey(token_mint),
        inputSol,
        token_symbol,
        new PublicKey(owner)
      );
      const response = await axios.post("/api/decode-signature", {
        txHash: txHash.txHash,
      });
      if (response.data) {
        toast.success(`Tokens Bought Successfully`, {
          duration: 10000,
          action: {
            label: "View Tx",
            onClick: () =>
              window.open(
                `https://explorer.solana.com/tx/${txHash.txHash}?cluster=devnet`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
          className: "z-20",
        });
      }
      await fetchWalletBalances();
    } catch (error) {
      console.log(error);
      toast("Error while buying tokens");
    } finally {
      refreshStates();
      setIsTradingFlag(false);
      setIsloading(false);
    }
  };

  const sellTokens = async () => {
    if (!wallet.publicKey) {
      toast("Please connect wallet to sell tokens");
      return;
    }
    try {
      setIsloading(true);

      const txHash = await sellTokenOnSolana(
        connection.connection,
        wallet,
        new PublicKey(token_mint),
        inputAmount,
        token_symbol,
        new PublicKey(owner)
      );
      const response = await axios.post("/api/decode-signature", {
        txHash: txHash.txHash,
      });

      if (response.data) {
        toast.success(`Tokens Sold Successfully`, {
          duration: 10000,
          action: {
            label: "View Tx",
            onClick: () =>
              window.open(
                `https://explorer.solana.com/tx/${txHash.txHash}?cluster=devnet`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
          className: "z-20",
        });
      }
      await fetchWalletBalances();
    } catch (error) {
      console.log(error);
      toast("Error while selling tokens");
    } finally {
      refreshStates();
      setIsTradingFlag(false);
      setIsloading(false);
    }
  };
  return (
    <Dialog open={isTrading}>
      <DialogContent className="sm:max-w-[425px] bg-[#16171c] text-white">
        <div className="grid gap-2 py-2">
          <div className="flex justify-center">
            <ImageRender imageUrl={token_image} callBackImageUrl="" />
          </div>
          <div className=" flex justify-center text-md font-mono">{`${token_name} (${token_symbol})`}</div>
          <div className="text-xs font-mono">
            {action === "buy_tokens"
              ? `Buying ${amount} ${token_symbol} at rate : ${token_price.toFixed(
                  10
                )}SOL`
              : `Selling ${amount} ${token_symbol} at rate : ${token_price.toFixed(
                  10
                )}SOL`}
          </div>
          <div className="flex justify-end text-xs font-mono">{`Slippage : ${slippage}%`}</div>
        </div>
        <div className="flex justify-center">
          <DialogFooter className="flex flex-col gap-2 md:flex md:gap-1">
            {!isLoading ? (
              <Button
                type="submit"
                className="bg-[#25294a]"
                onClick={async () =>
                  action === "buy_tokens"
                    ? await buyTokens()
                    : await sellTokens()
                }
              >
                Confirm
                {action === "buy_tokens"
                  ? `BUY ${token_symbol}`
                  : `SELL ${token_symbol}`}
              </Button>
            ) : (
              <Button type="submit" className="bg-[#25294a] w-[180px]">
                <Loader2 className="ml-2 h-6 w-6 animate-spin" />
              </Button>
            )}
            <Button
              onClick={() => {
                setIsTradingFlag(false);
              }}
              className="bg-[#25294a]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
