import { Suspense } from "react";
import { TeamTable } from "./team-table";
import { TeamPageHeader } from "./team-page-header";
import { TeamMembersSkeleton } from "./team-members-skeleton";

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

// Server Component - Main page wrapper
export default function TeamPage() {
  return (
    <div className="space-y-6">
      <TeamPageHeader />
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembersContent />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TeamMembersContent() {
  // Fetch team members on the server
  const teamMembers = await getTeamMembers();

  return <TeamTable teamMembers={teamMembers} />;
}

// Server-side data fetching function
async function getTeamMembers() {
  try {
    // Only fetch if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not available, returning empty team members array");
      return [];
    }
    
    const { getAllTeamMembers } = await import("@/lib/team-operations");
    return await getAllTeamMembers();
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
