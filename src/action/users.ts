"use server";

import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";
import { getRandomString } from "./random";

export const fetchUsers = async () => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("users").select("*");
  if (!error) return data;
  else return [];
};

export const fetchUser = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("users")
    .select(
      `user_address,full_name,email,trades( id, amount, token_traded, trade_type, trader_address,price, trade_signature), tokens(id,name,symbol,description,image,metadata_uri,owner,create_signature)
    `
    )
    .eq("user_address", id);

  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const createUser = async (user_address: string) => {
  const random_name = getRandomString(6);
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: random_name,
        user_address: user_address,
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

export const fetchUsersVariousCounts = async (
  user_address: string | undefined | null
) => {
  if (!user_address) {
    return null;
  }
  const supabase = createSupabaseReqRes();

  const { data, error } = await supabase.rpc("fetch_user_trade_data", {
    p_user_address: user_address,
  });
  if (!error && data) return data[0];
  return null;
};
