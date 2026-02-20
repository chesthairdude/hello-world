"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SWIPE_DURATION_MS = 280;

export default function CaptionVotingDeck({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [swipeDirection, setSwipeDirection] = useState(null);
  const isSubmittingRef = useRef(false);

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
    if (!current || isSubmittingRef.current) {
      return;
    }

    if (!current.captionId || typeof current.captionId !== "string") {
      setItems((previous) => previous.slice(1));
      return;
    }

    isSubmittingRef.current = true;
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

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        if (
          response.status === 409 &&
          typeof result?.error === "string" &&
          result.error.toLowerCase().includes("already voted")
        ) {
          setItems((previous) => previous.slice(1));
          return;
        }
        if (response.status === 400 || response.status === 404) {
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
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (initialItems.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-300/50">
        <h2 className="text-2xl font-semibold text-slate-900">No captions available</h2>
        <p className="mt-2 text-slate-600">
          Add captions in the database and refresh to start rating.
        </p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="rounded-3xl border border-emerald-300 bg-emerald-50 p-8 text-center shadow-xl shadow-emerald-100">
        <h2 className="text-2xl font-semibold text-emerald-700">All done</h2>
        <p className="mt-2 text-emerald-600">
          You rated all available captions for now.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/50 sm:p-10">
      <div className="space-y-5">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">
            Caption Rating
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Image {completedCount + 1} of {initialItems.length}
          </p>
        </div>

        <div
          className={`mx-auto w-full max-w-xs transition duration-300 ease-out sm:max-w-sm ${
            swipeDirection === "right"
              ? "translate-x-[130%] rotate-12 opacity-0"
              : swipeDirection === "left"
                ? "-translate-x-[130%] -rotate-12 opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.16)]">
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt="Caption image"
                className="m-3 block max-h-[58vh] w-[calc(100%-1.5rem)] rounded-2xl border-4 border-white object-contain shadow-2xl shadow-slate-400/55"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                Missing image URL
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {captionText || `No text in captions.content (caption id: ${current.captionId})`}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => submitVote(-1, "left")}
            disabled={isSubmitting}
            aria-label="Dislike (swipe left)"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl font-bold text-red-600 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:scale-105 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => submitVote(1, "right")}
            disabled={isSubmitting}
            aria-label="Like (swipe right)"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl font-bold text-emerald-600 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:scale-105 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ✓
          </button>
        </div>

        {isSubmitting ? (
          <p className="text-center text-sm text-slate-500">
            {swipeDirection === "right"
              ? "Swiping right..."
              : swipeDirection === "left"
                ? "Swiping left..."
                : "Submitting vote..."}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
