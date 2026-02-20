import { createClient } from "../../utils/supabase/server";
import CaptionVotingDeck from "./CaptionVotingDeck";

export const revalidate = 0;

function shuffleItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let votedImageIds = new Set();
  let voteHistoryError = null;

  const { data: existingVotes, error: existingVotesError } = await supabase
    .from("caption_votes")
    .select("caption_id")
    .eq("profile_id", user.id);

  if (existingVotesError) {
    voteHistoryError = existingVotesError;
  } else {
    const votedCaptionIds = (existingVotes ?? [])
      .map((vote) => vote.caption_id)
      .filter(Boolean);

    if (votedCaptionIds.length > 0) {
      const { data: votedCaptions, error: votedCaptionsError } = await supabase
        .from("captions")
        .select("id, image_id")
        .in("id", votedCaptionIds);

      if (votedCaptionsError) {
        voteHistoryError = votedCaptionsError;
      } else {
        votedImageIds = new Set(
          (votedCaptions ?? []).map((caption) => caption.image_id).filter(Boolean)
        );
      }
    }
  }

  const { data: captions, error } = await supabase
    .from("captions")
    .select(
      "id, caption_content:content, image:images!inner(id, url, additional_context)"
    )
    .not("content", "is", null)
    .not("content", "eq", "")
    .not("images.url", "is", null)
    .not("images.url", "eq", "")
    .order("created_datetime_utc", { ascending: false });

  const mappedItems = (captions ?? [])
    .map((caption) => {
      const image = Array.isArray(caption.image) ? caption.image[0] : caption.image;
      return {
        captionId: caption.id,
        captionContent: caption.caption_content,
        imageId: image?.id ?? null,
        imageUrl: image?.url ?? null,
        additionalContext: image?.additional_context ?? "",
      };
    })
    .filter(
      (item) =>
        item.captionContent !== null &&
        item.captionContent !== undefined &&
        String(item.captionContent).trim() !== "" &&
        item.imageId !== null &&
        item.imageId !== undefined &&
        item.imageUrl !== null &&
        item.imageUrl !== undefined &&
        String(item.imageUrl).trim() !== "" &&
        !votedImageIds.has(item.imageId)
    );

  const items = shuffleItems(mappedItems);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#155e75_0%,#0f172a_34%,#020617_70%)] px-8 py-14 sm:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="rounded-3xl border border-white/15 bg-slate-950/45 p-8 shadow-lg shadow-black/25 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
            Protected Rating
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">
            Caption Voting
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-200">
            Signed in as <span className="font-semibold">{user?.email}</span>
          </p>
        </header>

        {error || voteHistoryError ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-100 shadow-lg shadow-black/25">
            Failed to load captions: {(error || voteHistoryError).message}
          </div>
        ) : (
          <CaptionVotingDeck initialItems={items} />
        )}
      </div>
    </main>
  );
}
