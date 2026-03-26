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

    console.log('Updating project with id:', id);
    console.log('Update data:', JSON.stringify(body, null, 2));

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

    // Only update fields that exist in the database schema
    const updateData: Record<string, any> = {};

    // Map form fields to database fields
    // Handle portfolio-related fields sent by frontend
    if (body.title !== undefined) updateData.name = body.title || null;
    if (body.name !== undefined) updateData.name = body.name || null;
    if (body.description !== undefined) updateData.description = body.description || null;

    if (body.category !== undefined) updateData.type = body.category || null;
    else if (body.type !== undefined) updateData.type = body.type || null;

    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl || null;
    if (body.image_url !== undefined) updateData.image_url = body.image_url || null;
    if (body.heroImageUrl !== undefined) updateData.hero_image_url = body.heroImageUrl || null;
    if (body.hero_image_url !== undefined) updateData.hero_image_url = body.hero_image_url || null;

    if (body.status !== undefined) updateData.status = body.status || null;
    if (body.priority !== undefined) updateData.priority = body.priority || null;

    if (body.progress !== undefined) updateData.progress = Number(body.progress) || 0;
    if (body.manager !== undefined) updateData.manager = body.manager || null;

    if (body.start_date) updateData.start_date = new Date(body.start_date);
    if (body.end_date) updateData.end_date = new Date(body.end_date);

    // Handle Decimal fields - convert strings to numbers
    if (body.budget !== undefined && body.budget !== '') {
      updateData.budget = typeof body.budget === 'string' ? parseFloat(body.budget) : body.budget;
    }
    if (body.estimated_budget !== undefined && body.estimated_budget !== '') {
      updateData.estimated_budget = typeof body.estimated_budget === 'string' ? parseFloat(body.estimated_budget) : body.estimated_budget;
    }
    if (body.actual_budget !== undefined && body.actual_budget !== '') {
      updateData.actual_budget = typeof body.actual_budget === 'string' ? parseFloat(body.actual_budget) : body.actual_budget;
    }

    if (body.client_id !== undefined) updateData.client_id = body.client_id || null;
    if (body.created_by !== undefined) updateData.created_by = body.created_by || null;

    if (body.tasks_total !== undefined) updateData.tasks_total = Number(body.tasks_total) || 0;
    if (body.tasks_completed !== undefined) updateData.tasks_completed = Number(body.tasks_completed) || 0;

    // Ignore portfolio-specific fields that don't exist in the database schema:
    // slug, content, challenge, client (string), duration, featured, gallery,
    // githubUrl, overview, process, projectUrl, published, results, services,
    // solution, technologies, testimonial, year, order

    console.log('Final update data:', updateData);

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData
    });

    console.log('Project updated successfully');

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Error updating project:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // Check for table not exists error
    if (error.message?.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Database table not found',
          details: 'The project table has not been created yet. Please contact administrator.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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