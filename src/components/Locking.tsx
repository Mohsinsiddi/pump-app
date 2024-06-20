"use client";
import React, { useState } from "react";
import LockUnlockTokensToken from "./LockUnlockTokens";
import { LockedTokenAccountTyp } from "@/types/solanaTypes";

interface LockingOption {
  type: number;
  days: number;
  multiplier: number;
  account_data: LockedTokenAccountTyp | null;
}

interface LockingProps {
  tokenBalance: number;
  lockingOptions: LockingOption[];
}

const Locking: React.FC<LockingProps> = ({ tokenBalance, lockingOptions }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-items-center">
        {lockingOptions.map((option) => (
          <LockUnlockTokensToken
            key={option.type}
            option={option}
            tokenBalance={tokenBalance}
          />
        ))}
      </div>
    </div>
  );
};

export default Locking;
