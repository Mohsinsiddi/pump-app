import { NextResponse } from "next/server";
import { createSupabaseServerSide } from "@/lib/supabase/supabase-server-side";
interface IParams {
  tokenId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { tokenId } = params;
    if (!tokenId) {
      return NextResponse.json({ message: "Invalid Token Id" });
    }
    const supabase = createSupabaseServerSide();
    let { data, error } = await supabase.rpc("fetch_token_data_with_counts", {
      p_token_id: tokenId,
    });
    if (!error && data) return NextResponse.json(data);

    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json(null);
  }
}
