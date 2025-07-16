import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    const whereClause: any = {};
    
    if (published !== null) {
      whereClause.published = published === 'true';
    }
    
    if (featured !== null) {
      whereClause.featured = featured === 'true';
    }
    
    if (category) {
      whereClause.category = category;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });

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
      title,
      slug,
      description,
      content,
      category,
      imageUrl,
      heroImageUrl,
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
      projectUrl,
      githubUrl,
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

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        category,
        imageUrl,
        heroImageUrl,
        year,
        client,
        duration,
        services: services || [],
        overview,
        challenge,
        solution,
        process,
        gallery,
        results,
        testimonial,
        technologies: technologies || [],
        projectUrl,
        githubUrl,
        published: published || false,
        featured: featured || false,
        order: order || 0,
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