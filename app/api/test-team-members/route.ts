import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Test endpoint to check team members in database
export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST TEAM MEMBERS ENDPOINT ===');

    // Check database connection
    const count = await prisma.teamMember.count();
    console.log(`Total team members in DB: ${count}`);

    // Get all team members
    const allMembers = await prisma.teamMember.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        email: true,
        avatar: true,
        is_active: true,
        featured: true,
        order: true
      }
    });

    console.log('All members from DB:', allMembers);

    // Get active members
    const activeMembers = await prisma.teamMember.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
        featured: true
      }
    });

    console.log('Active members from DB:', activeMembers);

    // Get featured members
    const featuredMembers = await prisma.teamMember.findMany({
      where: {
        is_active: true,
        featured: true
      },
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
        featured: true
      }
    });

    console.log('Featured members from DB:', featuredMembers);

    return NextResponse.json({
      total: count,
      all: allMembers.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        department: m.department,
        email: m.email,
        avatar: m.avatar,
        is_active: m.is_active,
        featured: m.featured,
        order: m.order
      })),
      active: activeMembers.length,
      activeMembers: activeMembers,
      featured: featuredMembers.length,
      featuredMembers: featuredMembers
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      error: 'Database query failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
