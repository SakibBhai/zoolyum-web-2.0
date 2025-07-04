import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TeamMemberView } from "./team-member-view";
import { TeamMemberViewSkeleton } from "./team-member-view-skeleton";

interface TeamMemberPageProps {
  params: Promise<{ id: string }>;
}

// Server Component - Main page wrapper
export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<TeamMemberViewSkeleton />}>
        <TeamMemberContent id={id} />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TeamMemberContent({ id }: { id: string }) {
  // Fetch team member on the server
  const teamMember = await getTeamMember(id);

  if (!teamMember) {
    notFound();
  }

  return <TeamMemberView teamMember={teamMember} />;
}

// Server-side data fetching function
async function getTeamMember(id: string) {
  try {
    const { getTeamMemberById } = await import("@/lib/team-operations");
    return await getTeamMemberById(id);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return null;
  }
}
