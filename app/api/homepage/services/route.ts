import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

// GET /api/homepage/services - Get all homepage services
export async function GET() {
  try {
    const services = await prisma.homepage_services.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    if (services.length === 0) {
      // Return default services if none exist
      return NextResponse.json([
        {
          title: "Brand Strategy",
          description: "Strategic brand positioning and identity development",
          icon: "strategy",
          order: 1
        },
        {
          title: "Digital Design",
          description: "Modern digital experiences and user interfaces",
          icon: "design",
          order: 2
        },
        {
          title: "Growth Marketing",
          description: "Data-driven marketing strategies for scalable growth",
          icon: "marketing",
          order: 3
        }
      ]);
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching homepage services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage services' },
      { status: 500 }
    );
  }
}

// POST /api/homepage/services - Create new homepage service (Admin only)
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
    const { title, description, icon, order } = body;

    const service = await prisma.homepage_services.create({
      data: {
        id: createId(),
        title,
        description,
        icon,
        order: order || 0,
        is_active: true,
        updated_at: new Date()
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage service:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage service' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage/services - Bulk update homepage services (Admin only)
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
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { error: 'Services must be an array' },
        { status: 400 }
      );
    }

    // Delete existing services
    await prisma.homepage_services.deleteMany({
      where: { is_active: true }
    });

    // Create new services
    const newServices = await prisma.homepage_services.createMany({
      data: services.map((service: any, index: number) => ({
        id: createId(),
        title: service.title,
        description: service.description,
        icon: service.icon || '',
        order: service.order || index,
        is_active: true,
        updated_at: new Date()
      }))
    });

    // Fetch and return the created services
    const createdServices = await prisma.homepage_services.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(createdServices);
  } catch (error) {
    console.error('Error updating homepage services:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage services' },
      { status: 500 }
    );
  }
}