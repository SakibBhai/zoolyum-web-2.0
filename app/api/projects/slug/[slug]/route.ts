import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Since 'slug' field doesn't exist in the schema, we'll search by name or id
    // For now, we'll treat the slug as the project name
    const project = await prisma.project.findFirst({
      where: { name: slug },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Allow admin access to all projects via query parameter
    const isAdmin = request.nextUrl.searchParams.get('admin') === 'true';
    
    // Only return active projects for public access
    if (project.status !== 'active' && !isAdmin) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}