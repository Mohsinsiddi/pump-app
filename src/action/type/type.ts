export type Trade = {
  id: bigint;
  trade_signature: string;
  trader_address: string;
  token_traded: string;
  amount: bigint;
  price: string;
  created_at: string; // Use string for dates in JSON responses
  trade_type: "buy_tokens" | "sell_tokens";
};

export type TokenData = {
  id: string;
  owner: string;
  create_signature: string;
  name: string;
  symbol: string;
  image: string;
  metadata_uri: string;
  description: string;
  lpMatured: boolean;
  views: bigint;
  created_at: string; // Use string for dates in JSON responses
};

export type FetchTokenDataResponse = {
  token_data: TokenData;
  wishlist_count: number;
  trade_count: number;
  trades: Trade[];
};

export type WishlistType = {
  created_at: string;
  id: number;
  token_id: string;
  trade_type: "buy_tokens" | "sell_tokens" | null;
  user_address: string;
};
