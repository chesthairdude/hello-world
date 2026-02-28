"use client";

import { useState } from "react";
import VoteDeck from "./VoteDeck";
import UploadPanel from "./UploadPanel";

export default function VoteWorkspace({ initialItems = [], userEmail = "" }) {
  const [mode, setMode] = useState("vote");

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-200 bg-slate-50 px-4 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">FunnyOrNot</h1>
            {userEmail ? <p className="mt-1 text-xs text-slate-500">{userEmail}</p> : null}
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setMode("vote")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                mode === "vote"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Voting Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                mode === "upload"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Uploading Mode
            </button>
          </nav>

          <form action="/auth/signout" method="post" className="mt-8">
            <button
              type="submit"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign Out
            </button>
          </form>
        </aside>

        <section className="flex flex-1 items-center justify-center px-6 py-10">
          {mode === "vote" ? <VoteDeck initialItems={initialItems} /> : <UploadPanel />}
        </section>
      </div>
    </main>
  );
}
