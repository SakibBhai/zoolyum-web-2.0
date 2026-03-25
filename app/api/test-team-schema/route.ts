import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get one team member to see raw data
    const member = await prisma.teamMember.findFirst();

    if (!member) {
      return NextResponse.json({
        message: "No team members found. Please create one first.",
        hint: "Go to /admin/team/new to create a team member"
      });
    }

    // Return the raw database record
    return NextResponse.json({
      id: member.id,
      name: member.name,
      featured: member.featured,
      featured_type: typeof member.featured,
      order: member.order,
      order_type: typeof member.order,
      is_active: member.is_active,
      raw_member: member
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching team member",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
