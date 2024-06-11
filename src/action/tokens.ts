"use server";

import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";
import { FetchTokenDataResponse } from "./type/type";

export const fetchTokens = async () => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc("fetch_token_stats");
  if (error) {
    console.error("Error fetching token stats:", error);
    return null;
  }

  return data;
};

export const fetchPopularTokens = async () => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc(
    "fetch_popular_tokens_with_trades",
    { min_trade_count: 10 }
  );

  if (!error) return data;
  else return [];
};

export const fetchLPMaturedTokens = async () => {
  const supabase = createSupabaseReqRes();
  try {
    // Call the RPC function
    const { data, error } = await supabase.rpc("fetch_lp_matured_tokens");

    // Check for errors
    if (error) {
      console.error("Error fetching lp_matured tokens:", error);
      return [];
    }

    if (!error) return data;

    // Log or process the data
    console.log("LP Matured Tokens:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
};

export const fetchTokensCreatedByUser = async (
  user_address: string | undefined | null
) => {
  try {
    if (!user_address) {
      return null;
    }
    const supabase = createSupabaseReqRes();
    const { data, error } = await supabase.rpc("fetch_user_tokens", {
      user_address: user_address,
    });

    if (error) {
      console.error("Error fetching user tokens:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching user tokens:", error);
    return [];
  }
};

export const fetchToken = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("tokens")
    .select(
      `id,name,symbol,description,image,metadata_uri,owner,create_signature,created_at,views,trades( id, amount, token_traded, trade_type, trader_address,created_at,price,trade_signature)`
    )
    .eq("id", id);
  // .limit(10, { foreignTable: "trades" });
  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const fetchTokenById = async (tokenId: string) => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc(
    "fetch_token_data_with_trades_and_counts",
    {
      p_token_id: tokenId,
    }
  );
  console.log(data);
  if (error) {
    console.error("Error fetching token data:", error);
    return null;
  }

  return data as unknown as FetchTokenDataResponse;
};

export const viewTokenById = async (tokenId: string) => {
  const supabase = createSupabaseReqRes();

  const { data, error } = await supabase.rpc("increment_token_views", {
    p_token_id: tokenId,
  });
  console.log(data);
  console.log(error);
  if (!error) return true;
  else return false;
};

export const fetchTokenByIDWithCounts = async (tokenId: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.rpc("fetch_token_data_with_counts", {
    p_token_id: tokenId,
  });
  if (!error && data) return data;
  return null;
};

export const createToken = async (
  id: string,
  user_address: string,
  txHash: string,
  name: string,
  symbol: string,
  description: string,
  metadata_uri: string,
  image_uri: string
) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("tokens")
    .insert([
      {
        create_signature: txHash,
        description: description,
        name: name,
        symbol: symbol,
        id: id,
        image: image_uri,
        metadata_uri: metadata_uri,
        owner: user_address,
      },
    ])
    .select();
  console.log(data);
  console.log(error);
  if (!error) {
    // revalidatePath("/notes");
    return data;
  } else {
    return null;
  }
};

export const fetchIfTokensLaunchedOnPlatform = async (tokenIds: string[]) => {
  try {
    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return null;
    }
    const supabase = createSupabaseReqRes();
    let { data, error } = await supabase
      .from("tokens")
      .select(`id`)
      .in("id", tokenIds);
    if (!error && data) {
      return data;
    }
  } catch (error) {
    return null;
  }
};

export const fetchAllTokenDataForTokenIds = async (tokenIds: string[]) => {
  try {
    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return null;
    }
    const supabase = createSupabaseReqRes();
    let { data, error } = await supabase
      .from("tokens")
      .select("*")
      .in("id", tokenIds);
    if (!error && data) {
      return data;
    }
  } catch (error) {
    return null;
  }
};
