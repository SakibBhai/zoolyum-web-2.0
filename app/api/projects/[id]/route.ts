import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // If slug is being updated, check if it's already taken by another project
    if (slug && slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Process services field to ensure it's an array
    let processedServices = services;
    if (services !== undefined) {
      if (typeof services === 'string') {
        // Convert string to array, handling empty strings
        processedServices = services.trim() === '' ? [] : services.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(services)) {
        // If it's already an array, filter out empty strings
        processedServices = services.filter(s => s && s.trim().length > 0);
      } else {
        // If it's neither string nor array, default to empty array
        processedServices = [];
      }
    }

    // Process technologies field similarly
    let processedTechnologies = technologies;
    if (technologies !== undefined) {
      if (typeof technologies === 'string') {
        processedTechnologies = technologies.trim() === '' ? [] : technologies.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(technologies)) {
        processedTechnologies = technologies.filter(s => s && s.trim().length > 0);
      } else {
        processedTechnologies = [];
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(content !== undefined && { content }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(heroImageUrl !== undefined && { heroImageUrl }),
        ...(year !== undefined && { year }),
        ...(client !== undefined && { client }),
        ...(duration !== undefined && { duration }),
        ...(processedServices !== undefined && { services: processedServices }),
        ...(overview !== undefined && { overview }),
        ...(challenge !== undefined && { challenge }),
        ...(solution !== undefined && { solution }),
        ...(process !== undefined && { process }),
        ...(gallery !== undefined && { gallery }),
        ...(results !== undefined && { results }),
        ...(testimonial !== undefined && { testimonial }),
        ...(processedTechnologies !== undefined && { technologies: processedTechnologies }),
        ...(projectUrl !== undefined && { projectUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(published !== undefined && { published }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}