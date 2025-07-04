import { NextRequest, NextResponse } from 'next/server';
import { getAllTeamMembers, createTeamMember } from '@/lib/team-operations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
  console.error('API Error:', error);
  
  const defaultError: ApiError = {
    message: 'An unexpected error occurred',
    status: 500
  };

  // If error is already an ApiError, use it directly
  if (typeof error === 'object' && error !== null && 'status' in error) {
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
    const teamMembers = await getAllTeamMembers();
    return NextResponse.json(teamMembers);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json() as Partial<TeamMemberData>;
    
    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const newTeamMember: TeamMemberData = {
      name: data.name.trim(),
      role: data.role?.trim() || '',
      bio: data.bio?.trim() || '',
      image: data.image?.trim() || '',
      social: {
        twitter: data.social?.twitter?.trim() || '',
        linkedin: data.social?.linkedin?.trim() || '',
        github: data.social?.github?.trim() || '',
      }
    };

    const createdMember = await createTeamMember(newTeamMember);
    return NextResponse.json(createdMember, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}