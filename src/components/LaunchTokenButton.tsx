"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LaunchTokenButton() {
  const router = useRouter();
  return (
    <Button
      className="w-1/4 shadow-2xl bg-slate-100 text-black mb-3 hover:text-white"
      onClick={() => router.push("/launch-token")}
    >
      Launch your innovative Token
    </Button>
  );
}
