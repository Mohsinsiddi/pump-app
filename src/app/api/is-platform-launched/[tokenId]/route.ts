import { NextResponse } from "next/server";
import { createSupabaseServerSide } from "@/lib/supabase/supabase-server-side";

export async function POST(request: Request) {
  try {
    const { tokenIds } = await request.json();
    console.log(tokenIds);
    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return NextResponse.json(
        { message: "Invalid Token Ids" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerSide();
    let { data, error } = await supabase
      .from("tokens")
      .select(`id`)
      .in("id", tokenIds);
    console.log(data);
    if (error) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (!error && data) {
      // Create a map of existing token IDs
      const existingTokenIds = new Set(data.map((token) => token.id));

      // Map over the provided tokenIds and create the response array
      const result = tokenIds.map((tokenId) => ({
        tokenId,
        exists: existingTokenIds.has(tokenId),
      }));
      return NextResponse.json({ result }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
