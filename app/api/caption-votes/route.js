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

  const { data: targetCaption, error: targetCaptionError } = await supabase
    .from("captions")
    .select("id, image_id")
    .eq("id", captionId)
    .single();

  if (targetCaptionError || !targetCaption) {
    return NextResponse.json({ error: "Caption not found" }, { status: 404 });
  }

  const { data: captionsForImage, error: captionsForImageError } = await supabase
    .from("captions")
    .select("id")
    .eq("image_id", targetCaption.image_id);

  if (captionsForImageError) {
    return NextResponse.json({ error: captionsForImageError.message }, { status: 500 });
  }

  const imageCaptionIds = (captionsForImage ?? []).map((caption) => caption.id);

  if (imageCaptionIds.length > 0) {
    const { data: existingVotes, error: existingVotesError } = await supabase
      .from("caption_votes")
      .select("id")
      .eq("profile_id", user.id)
      .in("caption_id", imageCaptionIds)
      .limit(1);

    if (existingVotesError) {
      return NextResponse.json({ error: existingVotesError.message }, { status: 500 });
    }

    if (existingVotes && existingVotes.length > 0) {
      return NextResponse.json(
        { error: "You have already voted on this image" },
        { status: 409 }
      );
    }
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("caption_votes").insert({
    caption_id: captionId,
    profile_id: user.id,
    vote_value: voteValue,
    created_datetime_utc: now,
    modified_datetime_utc: now,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You have already voted on this image" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
