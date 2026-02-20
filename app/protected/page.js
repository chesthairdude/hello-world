import { createClient } from "../../utils/supabase/server";
import CaptionVotingDeck from "./CaptionVotingDeck";

export const revalidate = 0;

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: captions, error } = await supabase
    .from("captions")
    .select(
      "id, caption_content:content, image:images(id, url, image_description, additional_context)"
    )
    .not("content", "is", null)
    .not("content", "eq", "")
    .order("created_datetime_utc", { ascending: false });

  const items =
    captions?.map((caption) => {
      const image = Array.isArray(caption.image) ? caption.image[0] : caption.image;
      return {
        captionId: caption.id,
        captionContent: caption.caption_content,
        imageId: image?.id ?? null,
        imageUrl: image?.url ?? null,
        imageDescription: image?.image_description ?? "",
        additionalContext: image?.additional_context ?? "",
      };
    }) ?? [];

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

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-100 shadow-lg shadow-black/25">
            Failed to load captions: {error.message}
          </div>
        ) : (
          <CaptionVotingDeck initialItems={items} />
        )}
      </div>
    </main>
  );
}
