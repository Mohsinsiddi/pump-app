"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { SigninMessage } from "@/util";
import bs58 from "bs58";
import { useSession } from "next-auth/react";
import useStore from "@/app/store/useStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { createUser, fetchUser } from "@/action/users";

export function SignInDialog() {
  const { isUserSigned } = useStore();
  const { data: session, status } = useSession();

  const isNotExpired =
    new Date(session?.expires!).getTime() > new Date().getTime();

  const loading = status === "loading";

  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    if (
      (wallet.connected && status === "unauthenticated") ||
      (wallet.connected && !isNotExpired)
    ) {
      try {
        if (!wallet.connected) {
          walletModal.setVisible(true);
        }

        const csrf = await getCsrfToken();
        if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

        const message = new SigninMessage({
          domain: window.location.host,
          publicKey: wallet.publicKey?.toBase58(),
          statement: `I am signing as user with my wallet on Syphon launchpad for all the actions here with all understandings about this app.`,
          nonce: csrf,
        });

        const data = new TextEncoder().encode(message.prepare());
        const signature = await wallet.signMessage(data);
        const serializedSignature = bs58.encode(signature);

        signIn("credentials", {
          message: JSON.stringify(message),
          redirect: false,
          signature: serializedSignature,
        }).then(async () => {
          const user_data = await fetchUser(wallet.publicKey!.toBase58());
          console.log(user_data);
          if (!user_data) {
            const create_user_response = await createUser(
              wallet.publicKey!.toBase58()
            );
            console.log(create_user_response);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog
      open={
        (wallet.connected && status === "unauthenticated") ||
        (wallet.connected && !isNotExpired)
      }
    >
      <DialogContent className="sm:max-w-[425px] bg-[#070815]">
        <DialogHeader>
          <DialogTitle>Sign Message</DialogTitle>
          <DialogDescription className="text-white font-extrabold">
            I am signing as user with my wallet on Syphon launchpad for all the
            actions here with all understandings about this app.
          </DialogDescription>
        </DialogHeader>
        <div className=""></div>
        <div className="flex justify-center">
          {" "}
          <DialogFooter className="h-10">
            <Button
              type="submit"
              onClick={handleSignIn}
              className="hover:cursor-pointer"
            >
              Sign Message
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
