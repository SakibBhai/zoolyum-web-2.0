import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching services from database...');
    const services = await prisma.services.findMany({
      orderBy: [{ order: 'asc' }, { created_at: 'desc' }]
    });

    console.log('Found services:', services.length);

    // Transform dates to ISO strings for JSON serialization
    const transformedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      content: service.content,
      imageUrl: service.imageUrl,
      icon: service.icon,
      featured: service.featured,
      order: service.order,
      createdAt: service.created_at.toISOString(),
      updatedAt: service.updated_at.toISOString()
    }));

    console.log('Returning services:', transformedServices.length);
    return NextResponse.json(transformedServices);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    // Check if table doesn't exist
    if (error.message?.includes('does not exist')) {
      console.error('Services table does not exist in database');
      return NextResponse.json([], {
        status: 200,
        headers: {
          'X-Database-Error': 'true',
          'X-Error-Message': 'Services table not found - run prisma db push'
        }
      });
    }

    // Return empty array on any error to keep page working
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
    console.log('Creating service with data:', JSON.stringify(body, null, 2));

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

    console.log('Service created successfully:', service);

    return NextResponse.json({
      ...service,
      createdAt: service.created_at.toISOString(),
      updatedAt: service.updated_at.toISOString()
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'A service with this slug already exists',
          details: 'Please use a different slug'
        },
        { status: 409 }
      );
    }

    // Check for table not exists error
    if (error.message?.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Database table not found',
          details: 'The services table has not been created yet. Please contact administrator.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}