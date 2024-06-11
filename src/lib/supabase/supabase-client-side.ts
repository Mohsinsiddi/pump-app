import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../database.types";

export const createSupabaseClientSide = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
};
