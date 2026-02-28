import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import AuthForm from "./AuthForm";
import PageTransition from "../components/PageTransition";

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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-gradient)",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <PageTransition>
        <AuthForm />
      </PageTransition>
    </main>
  );
}
