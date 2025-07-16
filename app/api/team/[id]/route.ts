import { NextRequest, NextResponse } from "next/server";
import {
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/team-operations";
import { getCurrentUser } from "@/lib/stack-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/team/[id] - Get team member by ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const teamMember = await getTeamMemberById(id);
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error in GET /api/team/[id]:", error);
    return NextResponse.json(
      { error: "Team member not found" },
      { status: 404 }
    );
  }
}

// PUT /api/team/[id] - Update team member
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const teamMember = await updateTeamMember(id, {
      name: body.name,
      position: body.position,
      designation: body.designation,
      websiteTag: body.websiteTag,
      bio: body.bio,
      imageUrl: body.imageUrl,
      email: body.email,
      linkedin: body.linkedin,
      twitter: body.twitter,
      status: body.status,
      order: body.order,
      featured: body.featured,
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error in PUT /api/team/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete team member
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await deleteTeamMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/team/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
