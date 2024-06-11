"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import clsx from "clsx";
import { IndividualRatings, UserData } from "@/types/solanaTypes";
import {
  getUserLevel,
  normalizeScore,
  WEIGHTS,
  LEVEL_THRESHOLDS,
} from "@/util/ratingBuilder";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "./ui/button";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserLevelCardProps {
  userData: UserData;
}

const beautifyKey = (key: keyof IndividualRatings): string => {
  const map: Record<keyof IndividualRatings, string> = {
    lpMaturedTokensCount: "LP Matured Tokens Ratings",
    totalTokensCreated: "Total Tokens Created Ratings",
    buyTradeCount: "Buy Trade Count Ratings",
    totalTradeCount: "Total Trade Count Ratings",
    sellTradeCount: "Sell Trade Count Ratings",
  };
  return map[key];
};

const getUserDataKey = (key: keyof IndividualRatings): keyof UserData => {
  const map: Record<keyof IndividualRatings, keyof UserData> = {
    lpMaturedTokensCount: "lp_matured_tokens_count",
    totalTokensCreated: "total_tokens_created",
    buyTradeCount: "buy_trade_count",
    totalTradeCount: "total_trade_count",
    sellTradeCount: "sell_trade_count",
  };
  return map[key];
};

export const UserRewards: React.FC<UserLevelCardProps> = ({ userData }) => {
  const { rating, level } = getUserLevel(userData);

  const individualRatings: IndividualRatings = {
    lpMaturedTokensCount: normalizeScore(
      userData.lp_matured_tokens_count * WEIGHTS.lpMaturedTokensCount,
      1
    ),
    totalTokensCreated: normalizeScore(
      userData.total_tokens_created * WEIGHTS.totalTokensCreated,
      1
    ),
    buyTradeCount: normalizeScore(
      userData.buy_trade_count * WEIGHTS.buyTradeCount,
      1
    ),
    totalTradeCount: normalizeScore(
      userData.total_trade_count * WEIGHTS.totalTradeCount,
      1
    ),
    sellTradeCount: normalizeScore(
      userData.sell_trade_count * WEIGHTS.sellTradeCount,
      1
    ),
  };

  const pieData = (label: string, value: number, remaining: number) => ({
    labels: [label, "Remaining to next level"],
    datasets: [
      {
        data: [value, remaining],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });

  const getRemainingForNextLevel = (rating: number, level: number) => {
    return level < 10 ? LEVEL_THRESHOLDS[level + 1] - rating : 0;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-lg shadow-lg text-white transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl mt-2">
      <h2 className="text-2xl font-bold mb-4">User Rewards and Level Card</h2>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col justify-center items-center md:items-start mb-4">
          <h3 className="text-lg font-semibold mb-2">Total Rewards in SOL</h3>
          <div className="text-3xl font-bold text-green-400 mb-4">
            {0.000001} SOL
          </div>
          <Button className="bg-sky-700 hover:bg-sky-800">Claim Rewards</Button>
        </div>
        <div className="flex flex-col items-center mb-4">
          <span className="text-xl">Overall Rating</span>
          <div
            className={clsx(
              "text-3xl font-bold",
              rating > 75
                ? "text-green-400"
                : rating > 50
                ? "text-yellow-400"
                : "text-red-400"
            )}
          >
            {rating.toFixed(2)}
          </div>
          <div className="text-sm">Level: {level}</div>
          <Pie
            data={pieData(
              "Overall Rating",
              rating,
              getRemainingForNextLevel(rating, level)
            )}
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Individual Ratings</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(individualRatings).map((key) => {
            const typedKey = key as keyof IndividualRatings;
            const value = individualRatings[typedKey];
            const userDataKey = getUserDataKey(typedKey);
            const count = userData[userDataKey];

            return (
              <div
                key={key}
                className="flex flex-col items-center p-2 bg-gray-700 rounded-lg"
              >
                <span className="text-sm capitalize">
                  {beautifyKey(typedKey)}
                </span>
                <div
                  className={clsx(
                    "text-xl font-bold mb-2",
                    value > 75
                      ? "text-green-400"
                      : value > 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  )}
                >
                  {value.toFixed(2)}
                </div>
                <div className="text-xs mt-2">Count: {count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
