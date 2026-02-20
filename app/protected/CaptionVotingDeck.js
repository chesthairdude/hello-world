"use client";

import { useEffect, useMemo, useState } from "react";

const SWIPE_DURATION_MS = 280;

export default function CaptionVotingDeck({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [swipeDirection, setSwipeDirection] = useState(null);

  const current = useMemo(() => items[0] ?? null, [items]);
  const completedCount = initialItems.length - items.length;
  const rawCaptionText =
    current?.captionContent === null || current?.captionContent === undefined
      ? ""
      : String(current.captionContent);
  const captionText = rawCaptionText.trim();

  useEffect(() => {
    setSwipeDirection(null);
  }, [current?.captionId]);

  async function submitVote(voteValue, direction) {
    if (!current || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSwipeDirection(direction);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, SWIPE_DURATION_MS);
      });

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
        if (
          response.status === 409 &&
          typeof result?.error === "string" &&
          result.error.toLowerCase().includes("already voted")
        ) {
          setItems((previous) => previous.slice(1));
          return;
        }
        setSwipeDirection(null);
        throw new Error(result?.error || "Failed to submit vote");
      }

      setItems((previous) => previous.slice(1));
    } catch (err) {
      setSwipeDirection(null);
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
      <div className="space-y-5">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">
            Caption Rating
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
            Image {completedCount + 1} of {initialItems.length}
          </p>
        </div>

        <div
          className={`mx-auto w-full max-w-sm transition duration-300 ease-out ${
            swipeDirection === "right"
              ? "translate-x-[130%] rotate-12 opacity-0"
              : swipeDirection === "left"
                ? "-translate-x-[130%] -rotate-12 opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-200/60 bg-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_18px_40px_rgba(2,132,199,0.3)]">
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt="Caption image"
                className="block h-[30rem] w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                Missing image URL
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10">
              <p className="text-base font-semibold leading-snug text-white">
                {captionText || `No text in captions.content (caption id: ${current.captionId})`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => submitVote(-1, "left")}
            disabled={isSubmitting}
            aria-label="Dislike (swipe left)"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-300/70 bg-rose-500/20 text-3xl font-bold text-rose-100 transition hover:scale-105 hover:bg-rose-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => submitVote(1, "right")}
            disabled={isSubmitting}
            aria-label="Like (swipe right)"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/70 bg-emerald-500/20 text-3xl font-bold text-emerald-100 transition hover:scale-105 hover:bg-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ✓
          </button>
        </div>

        {isSubmitting ? (
          <p className="text-center text-sm text-slate-300">
            {swipeDirection === "right"
              ? "Swiping right..."
              : swipeDirection === "left"
                ? "Swiping left..."
                : "Submitting vote..."}
          </p>
        ) : null}

        {current.additionalContext ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm leading-relaxed text-slate-200">
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
