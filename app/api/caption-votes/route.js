import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { captionId, voteValue } = body ?? {};

  if (!captionId || typeof captionId !== "string") {
    return NextResponse.json({ error: "captionId is required" }, { status: 400 });
  }

  if (voteValue !== 1 && voteValue !== -1) {
    return NextResponse.json(
      { error: "voteValue must be 1 (upvote) or -1 (downvote)" },
      { status: 400 }
    );
  }

  const { data: captionExists, error: captionLookupError } = await supabase
    .from("captions")
    .select("id")
    .eq("id", captionId)
    .maybeSingle();

  if (captionLookupError) {
    return NextResponse.json({ error: "Unable to verify caption" }, { status: 500 });
  }

  if (!captionExists) {
    return NextResponse.json({ error: "Caption not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("caption_votes").insert(
    {
      caption_id: captionId,
      profile_id: user.id,
      vote_value: voteValue,
      created_datetime_utc: now,
      modified_datetime_utc: now,
    }
  );

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
