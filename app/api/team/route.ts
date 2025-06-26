import { NextRequest, NextResponse } from 'next/server';
import { getAllTeamMembers, createTeamMember } from '@/lib/team-operations';
import { verifyAuth } from '@/lib/auth';

// GET /api/team - Get all team members
export async function GET() {
  try {
    const teamMembers = await getAllTeamMembers();
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error in GET /api/team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const teamMember = await createTeamMember({
      name: body.name,
      position: body.position,
      bio: body.bio,
      imageUrl: body.imageUrl,
      email: body.email,
      linkedin: body.linkedin,
      twitter: body.twitter,
      status: body.status,
      order: body.order,
      featured: body.featured
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/team:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}