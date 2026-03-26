import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.services.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });

    // Transform dates to ISO strings for JSON serialization
    const transformedServices = services.map(service => ({
      ...service,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString()
    }));

    return NextResponse.json(transformedServices);
  } catch (error) {
    console.error('Error fetching services:', error);

    // Return empty array on error to keep page working
    return NextResponse.json([], {
      status: 200,
      headers: {
        'X-Database-Error': 'true',
        'X-Error-Message': error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const service = await prisma.services.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        content: body.content || null,
        imageUrl: body.imageUrl || null,
        icon: body.icon || null,
        featured: body.featured || false,
        order: body.order || 0
      }
    });

    return NextResponse.json({
      ...service,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        error: 'Failed to create service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}