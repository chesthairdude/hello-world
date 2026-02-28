import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export const revalidate = 0;

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/vote");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900">FunnyOrNot</h1>
          <p className="mt-3 text-sm text-slate-600">Sign in with Google to continue</p>
        </header>

        <a
          href="/auth/login"
          className="block w-full rounded-2xl bg-gradient-to-r from-[#FF4458] to-[#FF6B6B] px-5 py-3 text-center text-base font-bold text-white shadow-lg shadow-rose-200 transition hover:brightness-105"
        >
          Sign In with Google
        </a>
      </section>
    </main>
  );
}
