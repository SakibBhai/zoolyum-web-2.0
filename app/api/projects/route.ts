import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (type) {
      whereClause.type = type;
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' }
      ],
    };
    
    if (limit && limit > 0) {
      queryOptions.take = limit;
    }

    const projects = await prisma.project.findMany(queryOptions);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      description,
      content,
      category,
      image_url,
      hero_image_url,
      year,
      client,
      duration,
      services,
      overview,
      challenge,
      solution,
      process,
      gallery,
      results,
      testimonial,
      technologies,
      project_url,
      github_url,
      published,
      featured,
      order
    } = body;

    // Validate required fields
    if (!title || !slug || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, description, category' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        // Let database generate UUID automatically with @default(dbgenerated("gen_random_uuid()"))
        name: title, // Map title to name field required by schema
        description,
        // Note: Other fields like content, category, etc. may not exist in the current schema
        // Only including fields that exist in the Project model
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}