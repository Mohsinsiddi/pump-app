"use server";

import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";

export const fetchTrades = async () => {
  const supabase = createSupabaseReqRes();
  const offset = 1000 * 60 * 60 * 18; //6h days
  const myDate = new Date();
  myDate.setTime(myDate.getTime() - offset);

  const time_string = myDate.toISOString();
  let { data, error } = await supabase
    .from("trades")
    .select("*")
    .filter("created_at", "gt", time_string);

  if (!error) return data;
  else return [];
};

export const fetchTrade = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("trades").select("*").eq("id", id);
  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const createTrade = async (user_address: string, token_id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("trades")
    .insert([
      {
        amount: 1000,
        token_traded: token_id,
        trader_address: user_address,
        trade_type: "buy_tokens",
      },
    ])
    .select();
  if (!error) {
    // revalidatePath("/notes");
    return data;
  } else {
    return null;
  }
};

export const fetchTokenOHLCData = async (
  tokenId: string,
  intervalSeconds: number
) => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc("fetch_ohlc_data", {
    token_id_input: tokenId,
    interval_seconds: 300,
  });

  if (error) {
    console.error("Error fetching OHLC data:", error);
    return;
  }

  return data;
};
