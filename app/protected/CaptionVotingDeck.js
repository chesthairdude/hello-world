"use client";

import { useMemo, useState } from "react";

export default function CaptionVotingDeck({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const current = useMemo(() => items[0] ?? null, [items]);
  const completedCount = initialItems.length - items.length;

  async function submitVote(voteValue) {
    if (!current || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/caption-votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          captionId: current.captionId,
          voteValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to submit vote");
      }

      setItems((previous) => previous.slice(1));
    } catch (err) {
      setError(err.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (initialItems.length === 0) {
    return (
      <section className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center shadow-xl shadow-black/25">
        <h2 className="text-2xl font-semibold text-white">No captions available</h2>
        <p className="mt-2 text-slate-300">
          Add captions in the database and refresh to start rating.
        </p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-8 text-center shadow-xl shadow-black/25">
        <h2 className="text-2xl font-semibold text-emerald-100">All done</h2>
        <p className="mt-2 text-emerald-50/90">
          You rated all available captions for now.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/20 bg-slate-900/65 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">
            Caption Rating
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
            Image {completedCount + 1} of {initialItems.length}
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-2xl border border-cyan-200/40 bg-slate-950/80 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_14px_40px_rgba(2,132,199,0.25)] sm:p-4">
          <div className="overflow-hidden rounded-xl bg-slate-950">
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt={current.imageDescription || "Caption image"}
                className="mx-auto h-auto max-h-[26rem] w-full object-contain"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                Missing image URL
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => submitVote(1)}
            disabled={isSubmitting}
            aria-label="Upvote caption"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/70 bg-emerald-500/20 text-3xl font-bold text-emerald-100 transition hover:bg-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => submitVote(-1)}
            disabled={isSubmitting}
            aria-label="Downvote caption"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-300/70 bg-rose-500/20 text-3xl font-bold text-rose-100 transition hover:bg-rose-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ↓
          </button>
        </div>

        {isSubmitting ? (
          <p className="text-center text-sm text-slate-300">Submitting vote...</p>
        ) : null}

        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {current.captionContent || "Untitled caption"}
          </h2>
          {current.imageDescription ? (
            <p className="text-sm text-slate-300">{current.imageDescription}</p>
          ) : null}
        </div>

        {current.additionalContext ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
            {current.additionalContext}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
