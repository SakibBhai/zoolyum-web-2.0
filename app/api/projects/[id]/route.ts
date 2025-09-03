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
      overview,
      content,
      category,
      image_url,
      hero_image_url,
      year,
      client,
      duration,
      services,
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



    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(overview !== undefined && { overview }),
        ...(content !== undefined && { content }),
        ...(category && { category }),
        ...(image_url !== undefined && { image_url }),
        ...(hero_image_url !== undefined && { hero_image_url }),
        ...(year !== undefined && { year }),
        ...(client !== undefined && { client }),
        ...(duration !== undefined && { duration }),
        ...(services !== undefined && { services }),
        ...(challenge !== undefined && { challenge }),
        ...(solution !== undefined && { solution }),
        ...(process !== undefined && { process }),
        ...(gallery !== undefined && { gallery }),
        ...(results !== undefined && { results }),
        ...(testimonial !== undefined && { testimonial }),
        ...(technologies !== undefined && { technologies }),
        ...(project_url !== undefined && { project_url }),
        ...(github_url !== undefined && { github_url }),
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

    // Use a transaction to delete related records first, then the project
    await prisma.$transaction(async (tx) => {
      // Delete related content calendar entries
      await tx.content_calendar.deleteMany({
        where: { project_id: id },
      });

      // Delete related tasks
      await tx.tasks.deleteMany({
        where: { project_id: id },
      });

      // Delete related transactions
      await tx.transactions.deleteMany({
        where: { project_id: id },
      });

      // Delete related invoices
      await tx.invoices.deleteMany({
        where: { project_id: id },
      });

      // Delete related recurring invoices
      await tx.recurring_invoices.deleteMany({
        where: { project_id: id },
      });

      // Finally delete the project
      await tx.project.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: 'Project and all related data deleted successfully' },
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