"use client";

import { Key, useEffect, useState } from "react";
import Link from "next/link";

import WordMark from "@/components/WordMark";
import { MdMenu, MdClose } from "react-icons/md";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "./ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { signOut, useSession } from "next-auth/react";
import { decodeTxSignature } from "@/util/solana/decoder/txDecoder";
import axios from "axios";

type NavBarProps = {};

export default function NavBar({}: NavBarProps) {
  const wallet = useWallet();
  const connection = useConnection();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const settings = ["Launch", "Profile", "wallets"];

  useEffect(() => {
    const updateUserStatus = async () => {
      signOut();
    };
    if (!wallet.connected && status === "authenticated") {
      updateUserStatus();
    }
  }, [wallet.connected]);

  useEffect(() => {
    async function call() {
      try {
        // const data = await decodeTxSignature(connection.connection, [
        //   "4xd84oA7jGQPLdkAETP5WqNjExBgCHBTiQzcibuM1ZbaXwc2YFX7zusdRPTwkoQ42yVL764TutXvdYstYBs7txMf",
        // ]);
        // console.log(data);
        // const response = await axios.post("/api/decode-signature", {
        //   txHash:
        //     "3XYQ8hwmMSHUhbeAcyEKvA8GeLXyKCV6HrZuEmvHtWmhmmKMN6KSL3dCPTkDVT8vb6zFHxvM75CKqu16N23BFULX",
        // });
        // console.log(response.data);
      } catch (error) {
        //@ts-ignore
        console.log(error.response.data);
      }
    }
    call();
  });

  return (
    <nav className="md-:py-6 px-4 py-4 md:px-6" aria-label="Main">
      <div className="mx-auto flex max-w-6xl flex-col justify-between py-2 font-medium text-white md:flex-row md:items-center">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="z-50 ml-[-40px] md:ml-[-70px]"
            onClick={() => setOpen(false)}
          >
            <WordMark />
            <span className="sr-only">Glisten.ai Home Page</span>
          </Link>
          <button
            type="button"
            className="block p-2 text-3xl text-white md:hidden"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <MdMenu />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
        {/* Mobile Nav */}
        <div
          className={clsx(
            "ga-4 fixed bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-end bg-[#070815] pr-4 pt-14 transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]"
          )}
        >
          <button
            type="button"
            className="fixed right-4 top-4 mb-4 block p-2 text-3xl text-white md:hidden"
            aria-expanded={open}
            onClick={() => setOpen(false)}
          >
            <MdClose />
            <span className="sr-only">Close menu</span>
          </button>

          <div className="grid justify-items-end gap-8" key={1}>
            {settings.map((item: string, index) => {
              if (item === "wallets") {
                return (
                  <WalletMultiButton
                    style={{
                      borderRadius: "10px",
                      width: "max-content",
                      backgroundColor: "25294a",
                      border: "0px solid #67676F",
                      marginLeft: "10px",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "12px",
                      padding: "5px",
                      height: "32px",
                      fontFamily: "Orbitron",
                      letterSpacing: "2px",
                    }}
                    key={index}
                  />
                );
              }
              if (item === "Launch") {
                return (
                  <div className="" key={item}>
                    {wallet && wallet.connected && (
                      <Button
                        className="bg-[#070815] font-extrabold font-mono"
                        onClick={() => router.push(`/launch-token`)}
                      >
                        Launch
                      </Button>
                    )}
                  </div>
                );
              }
              return (
                <div className="" key={item}>
                  {wallet && wallet.connected && (
                    <Button
                      className="bg-[#070815] font-extrabold font-mono"
                      onClick={() => router.push(`/profile`)}
                    >
                      Profile
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Nav */}
        <ul className=" hidden gap-4 md:flex">
          {settings.map((item) => {
            if (item === "wallets") {
              return (
                <li key={item}>
                  <WalletMultiButton
                    style={{
                      borderRadius: "10px",
                      width: "max-content",
                      backgroundColor: "#25294a",
                      border: "0px solid #67676F",
                      marginLeft: "10px",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px",
                      padding: "5px",
                      height: "32px",
                      fontFamily: "Orbitron",
                      letterSpacing: "2px",
                    }}
                  />
                </li>
              );
            }
            if (item === "Launch") {
              return (
                <li key={item}>
                  <div className="">
                    {wallet && wallet.connected && (
                      <Button
                        className="bg-[#070815] font-extrabold font-mono"
                        onClick={() => router.push(`/launch-token`)}
                      >
                        Launch
                      </Button>
                    )}
                  </div>
                </li>
              );
            }
            return (
              <li key={item}>
                <div className="">
                  {wallet && wallet.connected && (
                    <Button
                      className="bg-[#070815] font-extrabold font-mono"
                      onClick={() => router.push(`/profile`)}
                    >
                      Profile
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
