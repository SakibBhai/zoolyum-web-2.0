import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

// GET /api/homepage/statistics - Get all statistics
export async function GET() {
  try {
    const statistics = await prisma.homepage_statistics.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    if (statistics.length === 0) {
      // Return default statistics if none exist
      return NextResponse.json([
        { label: "Years Experience", value: "10", suffix: "+", order: 1 },
        { label: "Projects Completed", value: "50", suffix: "+", order: 2 },
        { label: "Happy Clients", value: "30", suffix: "+", order: 3 },
        { label: "Industry Awards", value: "5", suffix: "", order: 4 }
      ]);
    }

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// POST /api/homepage/statistics - Create new statistic (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label, value, suffix, order } = body;

    const statistic = await prisma.homepage_statistics.create({
      data: {
        id: createId(),
        label,
        value,
        suffix,
        order: order || 0,
        is_active: true,
        updated_at: new Date()
      }
    });

    return NextResponse.json(statistic, { status: 201 });
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage/statistics - Bulk update statistics (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { statistics } = body;

    if (!Array.isArray(statistics)) {
      return NextResponse.json(
        { error: 'Statistics must be an array' },
        { status: 400 }
      );
    }

    // Delete existing statistics
    await prisma.homepage_statistics.deleteMany({
      where: { is_active: true }
    });

    // Create new statistics
    const newStatistics = await prisma.homepage_statistics.createMany({
      data: statistics.map((stat: any, index: number) => ({
        id: createId(),
        label: stat.label,
        value: stat.value,
        suffix: stat.suffix || '',
        order: stat.order || index,
        is_active: true,
        updated_at: new Date()
      }))
    });

    // Fetch and return the created statistics
    const createdStatistics = await prisma.homepage_statistics.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(createdStatistics);
  } catch (error) {
    console.error('Error updating statistics:', error);
    return NextResponse.json(
      { error: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}