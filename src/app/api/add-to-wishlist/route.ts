import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { createSupabaseServerSide } from "@/lib/supabase/supabase-server-side";
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // const token = await getToken();
    console.log(session);
    if (!session?.user?.name) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 401 }
      );
    }
    const { token_id } = await request.json();
    console.log(token_id);
    const supabase = createSupabaseServerSide();
    let { data, error } = await supabase
      .from("whishlist")
      .insert([
        {
          user_address: session?.user?.name,
          token_id,
        },
      ])
      .select();
    console.log(data);
    console.log(error);
    if (!error) {
      // revalidatePath("/notes");
      return NextResponse.json({
        address: session?.user?.name,
        data,
      });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
