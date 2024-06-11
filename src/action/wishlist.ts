"use server";

import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";
import { getRandomString } from "./random";

export const fetchWishlists = async () => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("whishlist").select("*");
  if (!error) return data;
  else return [];
};

export const fetchWishlist = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("whishlist")
    .select("*")
    .eq("id", id);

  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const fetchWishlistByUser = async (
  userAddress: string | null | undefined,
  token_id: string
) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("whishlist")
    .select("*")
    .match({ user_address: userAddress, token_id });

  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const fetchUserWishlistsData = async (userAddress: string) => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc("fetch_user_wishlisted_tokens", {
    user_addr: userAddress,
  });

  if (error) {
    console.error("Error fetching wishlisted tokens:", error);
    return [];
  }

  return data;
};

export const fetchUserWishlists = async (
  userAddress: string | null | undefined
) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("whishlist")
    .select(`token_id`)
    .match({ user_address: userAddress });

  if (!error && data && data.length > 0) return data;
  else return null;
};

export const createWishlist = async (
  user_address: string,
  token_id: string
) => {
  const random_name = getRandomString(6);
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("whishlist")
    .insert([
      {
        user_address: user_address,
        token_id,
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
