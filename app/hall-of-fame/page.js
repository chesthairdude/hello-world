import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import HallOfFamePageClient from "./HallOfFamePageClient";

export const revalidate = 0;

export default async function HallOfFamePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return <HallOfFamePageClient userEmail={user.email ?? ""} />;
}
