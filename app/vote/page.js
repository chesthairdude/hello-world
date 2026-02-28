import { redirect } from "next/navigation";
import VoteWorkspace from "./VoteWorkspace";
import { getVoteWorkspaceData } from "./getVoteWorkspaceData";

export const revalidate = 0;

export default async function VotePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { user, items } = await getVoteWorkspaceData();

  if (!user) {
    redirect("/auth");
  }
  const mode = resolvedSearchParams?.mode === "upload" ? "upload" : "vote";

  return (
    <VoteWorkspace
      initialItems={items}
      userEmail={user.email ?? ""}
      initialMode={mode}
    />
  );
}
