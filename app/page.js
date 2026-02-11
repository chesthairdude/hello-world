import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-slate-700/70 bg-slate-900/50 p-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Google OAuth Gate
          </p>
          <h1 className="text-4xl font-semibold text-white">Welcome</h1>
          <p className="text-slate-300">
            A protected route is available at <code>/protected</code>.
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <p className="text-slate-200">Signed in as {user.email}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/protected"
                className="rounded-lg bg-white px-4 py-2 font-medium text-slate-900"
              >
                Open protected route
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-500 px-4 py-2 font-medium text-slate-200"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-300">
              You are not signed in. Access to <code>/protected</code> is gated.
            </p>
            <a
              href="/auth/login"
              className="inline-flex rounded-lg bg-white px-4 py-2 font-medium text-slate-900"
            >
              Sign in with Google
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
