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

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newTeamMember: TeamMemberData = {
      name: data.name.trim(),
      role: data.role?.trim() || "",
      bio: data.bio?.trim() || "",
      image: data.image?.trim() || "",
      social: {
        twitter: data.social?.twitter?.trim() || "",
        linkedin: data.social?.linkedin?.trim() || "",
        github: data.social?.github?.trim() || "",
      },
    };

    const createdMember = await createTeamMember(newTeamMember);

    // Revalidate the team page to show updated data immediately
    revalidatePath('/team');
    revalidatePath('/admin/team');

    return NextResponse.json(createdMember, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
