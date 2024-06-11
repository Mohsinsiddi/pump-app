"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  TOTAL_LINEAR_BONDING_SALE_SUPPLY,
  TOTAL_SUPPLY,
} from "@/lib/smart-contract/solana/constants";
import { Label } from "./ui/label";
import ToolTipRenderer from "./ToolTipRenderer";

type ProgressBarProps = {
  total_supply: number;
  h: string;
  color?: string; // Optional color prop
};

export function ProgressBarBondingCurve({
  total_supply,
  h,
  color = "bg-green-500", // Default color if none is provided
}: ProgressBarProps) {
  const progressValue = (total_supply / TOTAL_LINEAR_BONDING_SALE_SUPPLY) * 100;

  return (
    <div className="-mt-2">
      <ToolTipRenderer message={`Bonding Curve progress`}>
        <Label
          htmlFor="progress_bar"
          className={`text-xs ${h === "4" ? "md:text-lg" : ""}`}
        >
          BCP: {progressValue.toFixed(5)}%
        </Label>
      </ToolTipRenderer>

      <div
        className={`w-[60%] h-${h} bg-gray-300 rounded-full overflow-hidden`}
      >
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>
    </div>
  );
}
