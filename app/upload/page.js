import { redirect } from "next/navigation";
import VoteWorkspace from "../vote/VoteWorkspace";
import { getVoteWorkspaceData } from "../vote/getVoteWorkspaceData";

export const revalidate = 0;

export default async function UploadPage() {
  const { user, items } = await getVoteWorkspaceData();

  if (!user) {
    redirect("/auth");
  }

  return <VoteWorkspace initialItems={items} userEmail={user.email ?? ""} initialMode="upload" />;
}
