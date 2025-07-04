import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TeamMemberEditForm } from "./team-member-edit-form";
import { TeamMemberEditSkeleton } from "./team-member-edit-skeleton";

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

// Server Component - Main page wrapper
export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<TeamMemberEditSkeleton />}>
        <TeamMemberEditContent id={id} />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TeamMemberEditContent({ id }: { id: string }) {
  // Fetch team member on the server
  const teamMember = await getTeamMember(id);

  if (!teamMember) {
    notFound();
  }

  return <TeamMemberEditForm teamMember={teamMember} />;
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
