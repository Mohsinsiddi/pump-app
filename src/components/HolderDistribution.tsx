import { TOTAL_SUPPLY } from "@/lib/smart-contract/solana/constants";
import React from "react";

type DataInterface = {
  topHolderDetails: { owner: string; balance: number }[];
};

export default function HolderDistribution({
  topHolderDetails,
}: DataInterface) {
  return (
    <div className="w-[360px]">
      <div className="flex justify-center font-extrabold text-lg md:text-xl text-amber-500">
        Holders Distribution
      </div>
      <div>
        {topHolderDetails.map((item) => {
          return (
            <div className="flex justify-between" key={item.owner}>
              <div className="font-semibold text-xs md:text-md text-amber-100">
                {`${item.owner.slice(0, 10)}...${item.owner.slice(-10)}`}
              </div>
              <div className="font-semibold text-xs md:text-md text-amber-100">
                {((item.balance / TOTAL_SUPPLY) * 100).toFixed(5)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
