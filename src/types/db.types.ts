export type TradeType = {
  id: number;
  amount: number;
  price: string;
  token_traded: string;
  trade_type: "buy_tokens" | "sell_tokens" | null;
  trader_address: string;
  created_at: string;
  trade_signature: string;
};

export type TokenDataType = {
  create_signature: string;
  created_at: string;
  description: string;
  id: string;
  image: string;
  metadata_uri: string;
  name: string;
  owner: string;
  symbol: string;
  trades: TradeType[];
};

export type TokenDataTypeWithTrades = {
  create_signature: string;
  created_at: string;
  description: string;
  id: string;
  image: string;
  metadata_uri: string;
  name: string;
  owner: string;
  symbol: string;
  views: number;
  lpMatured: boolean;
};

export type HighlightedTokenData = {
  create_signature: string;
  created_at: string;
  description: string;
  id: string;
  image: string;
  metadata_uri: string;
  name: string;
  owner: string;
  symbol: string;
  views: number;
  lpMatured: boolean;
  trade_count?: number;
  wishlist_count?: number;
};

export type ExploreTokenDataType = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  owner: string;
  metadata_uri: string;
  description: string;
  views: number;
  created_at: string;
  trade_count: number;
  total_supply: number;
  wishlist_count: number;
};

export type TokenDataTypeWithMostTrades = {
  id: string;
  name: string;
  symol: string;
  image: string;
  metadata_uri: string;
  description: string;
  trade_count: number;
  owner: string;
};

export type PopularTokenDataType = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  metadata_uri: string;
  description: string;
  owner: string;
  trade_count: number;
  total_supply: number;
  wishlist_count: number;
  views: number;
};

export type CreatedTokens =
  | {
      id: string;
      name: string;
      symbol: string;
      image: string;
      metadata_uri: string;
      description: string;
      views: number;
      created_at: string;
      trade_count: number;
      total_supply: number;
      wishlist_count: number;
    }[]
  | null;

export type WishlistTokens =
  | {
      id: string;
      name: string;
      symbol: string;
      image: string;
      metadata_uri: string;
      description: string;
      owner: string;
      views: number;
      trade_count: number;
      total_supply: number;
      wishlist_count: number;
    }[]
  | null;

export type LPMaturedTokens = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  metadata_uri: string;
  description: string;
  owner: string;
  views: number;
  trade_count: number;
  total_supply: number;
  wishlist_count: number;
};

export type UserRewardsCountType = {
  user_address: string;
  total_trade_count: number;
  sell_trade_count: number;
  buy_trade_count: number;
  total_tokens_created: number;
  lp_matured_tokens_count: number;
} | null;
