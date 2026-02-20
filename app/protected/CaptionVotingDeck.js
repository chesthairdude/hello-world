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
    <section className="overflow-hidden rounded-3xl border border-white/20 bg-slate-900/65 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative h-80 bg-slate-950 md:h-full">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.imageDescription || "Caption image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-300">
              Missing image URL
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs uppercase tracking-[0.2em] text-slate-200">
            Image {completedCount + 1} of {initialItems.length}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">
              Caption Rating
            </p>
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

          <div className="mt-auto flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitVote(1)}
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Upvote"}
            </button>
            <button
              type="button"
              onClick={() => submitVote(-1)}
              disabled={isSubmitting}
              className="rounded-xl border border-rose-300/50 bg-rose-500/20 px-5 py-3 font-semibold text-rose-50 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Downvote"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
