export type RenderData = {
  name: string | undefined;
  symbol: string | undefined;
  description: string | undefined;
  image: string | undefined;
  isMutable: boolean | undefined;
  isFullyFetched: boolean;
  amount: number;
  mint: string;
  decimal: number;
  isPlatformLaunched?: boolean; // Add optional property
};
export type UserData = {
  user_address: string;
  total_trade_count: number;
  sell_trade_count: number;
  buy_trade_count: number;
  total_tokens_created: number;
  lp_matured_tokens_count: number;
};

export type IndividualRatings = {
  lpMaturedTokensCount: number;
  totalTokensCreated: number;
  buyTradeCount: number;
  totalTradeCount: number;
  sellTradeCount: number;
};
