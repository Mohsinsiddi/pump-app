"use server";

import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";
import { getRandomString } from "./random";

export const fetchHighlights = async () => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("highlights").select("*");
  if (!error) return data;
  else return [];
};

export const fetchHighlight = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("id", id);

  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const fetchPositionBasedHighlights = async () => {
  const supabase = createSupabaseReqRes();
  const { data, error } = await supabase.rpc("fetch_highlights_by_position");

  if (!error) return data;
  else return [];
};

export const createHighlight = async (
  user_address: string,
  signature: string,
  position_bought: number,
  price: number,
  hours: number,
  token_address: string,
  start_time: string
) => {
  const random_name = getRandomString(6);
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase
    .from("highlights")
    .insert([
      {
        creator_address: user_address,
        highlight_signature: signature,
        position: position_bought,
        price_paid: price,
        slot_hours: hours,
        token_id: token_address,
        start_time: start_time,
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
