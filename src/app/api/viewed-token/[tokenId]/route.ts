import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import { createSupabaseServerSide } from "@/lib/supabase/supabase-server-side";

interface IParams {
  tokenId?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
) {
  try {
    const { tokenId } = params;
    if (!tokenId) {
      return NextResponse.json({ message: "Invalid Token Id" });
    }
    const supabase = createSupabaseServerSide();

    const { data, error } = await supabase.rpc("increment_token_views", {
      p_token_id: tokenId,
    });

    if (error) {
      console.error("Error incrementing token views:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
