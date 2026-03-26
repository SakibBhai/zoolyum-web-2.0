import { NextRequest, NextResponse } from "next/server";
import { createTeamMember, getAllTeamMembers } from "@/lib/team-operations";
import { auth } from "@/lib/next-auth";
import { revalidatePath } from "next/cache";

interface ApiError {
  message: string;
  code?: string;
  status: number;
}

interface TeamMemberData {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// Error handler utility
function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  const defaultError: ApiError = {
    message: "An unexpected error occurred",
    status: 500,
  };

  // If error is already an ApiError, use it directly
  if (typeof error === "object" && error !== null && "status" in error) {
    const apiError = error as ApiError;
    return NextResponse.json(
      { error: apiError.message || defaultError.message },
      { status: apiError.status }
    );
  }

  // If error is a standard Error instance
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: defaultError.status }
    );
  }

  return NextResponse.json(
    { error: defaultError.message },
    { status: defaultError.status }
  );
}

// GET /api/team - Get all team members
export async function GET() {
  try {
    console.log('=== TEAM API CALLED ===');

    // Check if DATABASE_URL is available during build
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not available, returning empty team members array");
      return NextResponse.json([]);
    }

    console.log('Fetching team members from database...');
    const teamMembers = await getAllTeamMembers();
    console.log(`Team members fetched: ${teamMembers.length} total`);
    console.log('Active members:', teamMembers.filter(m => m.status === 'ACTIVE').length);
    console.log('Featured members:', teamMembers.filter(m => m.featured).length);

    // Log each member for debugging
    teamMembers.forEach(member => {
      console.log(`- ${member.name}: status=${member.status}, featured=${member.featured}, designation=${member.designation}`);
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Team API Error:', error);
    return handleApiError(error);
  }
}

// POST /api/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    // Check authentication using NextAuth
    const session = await auth();

    // In development, allow requests
    // In production, require authentication
    if (process.env.NODE_ENV === 'production' && !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure DATABASE_URL is present for write operations
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const data = (await request.json()) as Partial<TeamMemberData>;

    console.log('POST /api/team - Received data:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate unique email if not provided (database requires unique email)
    const uniqueEmail = data.email?.trim() || `${data.name.trim().toLowerCase().replace(/\s+/g, '.')}@${Date.now()}@zoolyum.internal`;

    const newTeamMember: TeamMemberData = {
      name: data.name.trim(),
      position: data.position?.trim() || "Team Member",
      designation: data.designation?.trim() || "General",
      websiteTag: data.websiteTag?.trim() || `${Date.now()}`,
      bio: data.bio?.trim() || "",
      imageUrl: data.imageUrl?.trim() || "/placeholder-user.jpg",
      email: uniqueEmail,
      linkedin: data.linkedin?.trim() || data.social?.linkedin?.trim() || "",
      twitter: data.twitter?.trim() || data.social?.twitter?.trim() || "",
      status: data.status || "ACTIVE",
      featured: data.featured || false,
      order: data.order || 0,
      social: data.social || {}
    };

    console.log('Creating team member with data:', JSON.stringify(newTeamMember, null, 2));

    const createdMember = await createTeamMember(newTeamMember);

    // Revalidate the team page to show updated data immediately
    revalidatePath('/team');
    revalidatePath('/admin/team');
    revalidatePath('/'); // Home page

    return NextResponse.json(createdMember, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/team:", error);
    return NextResponse.json(
      { error: "Failed to create team member", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
