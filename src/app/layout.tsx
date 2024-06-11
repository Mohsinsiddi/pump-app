import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import { SolanaWalletAdapter } from "@/components/SolanaWallets/SolanaWallets";
import { NextAuthProvider } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Siphon App",
  description: "Siphon Innovative Launchpad ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="grid bg-[#070815] text-white">
        <NextAuthProvider>
          <SolanaWalletAdapter>
            <Header />
            <main>{children}</main>
            <Toaster />
            <SonnerToaster />
            <Footer />
          </SolanaWalletAdapter>
        </NextAuthProvider>
      </body>
    </html>
  );
}
