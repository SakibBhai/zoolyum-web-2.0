import { Suspense } from "react";
import { LeadershipConfig } from "./leadership-config";
import { LeadershipConfigSkeleton } from "./leadership-config-skeleton";

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

// Server Component - Main page wrapper
export default function LeadershipTeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leadership Team Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage which team members appear in the Leadership section on the Team page
          </p>
        </div>
      </div>

      <Suspense fallback={<LeadershipConfigSkeleton />}>
        <LeadershipConfigContent />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function LeadershipConfigContent() {
  // Fetch team members on the server
  const teamMembers = await getTeamMembers();

  return <LeadershipConfig allTeamMembers={teamMembers} />;
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
    const allMembers = await getAllTeamMembers();

    // Only return active members
    return allMembers.filter(member => member.status === 'ACTIVE');
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
