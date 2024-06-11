import { UserData } from "@/types/solanaTypes";

export const WEIGHTS = {
  lpMaturedTokensCount: 0.25,
  totalTokensCreated: 0.1,
  buyTradeCount: 0.005,
  totalTradeCount: 0.0005,
  sellTradeCount: 0.0025,
};

export const LEVEL_THRESHOLDS: { [key: number]: number } = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
  6: 600,
  7: 700,
  8: 800,
  9: 900,
  10: 1000,
};

// Function to calculate the weighted score
export function calculateScore(userData: UserData): number {
  return (
    userData.lp_matured_tokens_count * WEIGHTS.lpMaturedTokensCount +
    userData.total_tokens_created * WEIGHTS.totalTokensCreated +
    userData.buy_trade_count * WEIGHTS.buyTradeCount +
    userData.total_trade_count * WEIGHTS.totalTradeCount +
    userData.sell_trade_count * WEIGHTS.sellTradeCount
  );
}

// Function to map score to a 0-100 rating
export function normalizeScore(score: number, maxScore: number): number {
  return (score / maxScore) * 100;
}

// Function to determine level based on the rating
export function determineLevel(rating: number): number {
  for (let level = 10; level >= 0; level--) {
    if (rating >= LEVEL_THRESHOLDS[level]) {
      return level;
    }
  }
  return 0;
}

// Main function to get user level
export function getUserLevel(userData: UserData): {
  rating: number;
  level: number;
} {
  const maxPossibleScore = 1; // As the sum of all weights is 1
  const score = calculateScore(userData);
  const rating = normalizeScore(score, maxPossibleScore);
  const level = determineLevel(rating);
  return { rating, level };
}
