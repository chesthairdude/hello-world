import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-300/50 sm:p-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">
            Google OAuth Gate
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Welcome</h1>
          <p className="text-slate-600">
            A protected route is available at <code>/protected</code>.
          </p>
        </div>

        {user ? (
          <div className="space-y-5">
            <p className="text-slate-700">Signed in as {user.email}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/protected"
                className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
              >
                Open protected route
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 shadow-lg shadow-slate-200 transition hover:bg-slate-100"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-slate-600">
              You are not signed in. Access to <code>/protected</code> is gated.
            </p>
            <a
              href="/auth/login"
              className="inline-flex rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
            >
              Sign in with Google
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
