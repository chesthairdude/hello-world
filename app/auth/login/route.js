import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function GET(request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${request.nextUrl.origin}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(data.url);
}
