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
      name,
      description,
      client_id,
      status,
      priority,
      type,
      start_date,
      end_date,
      budget,
      estimated_budget,
      actual_budget,
      progress,
      manager,
      created_by,
      tasks_total,
      tasks_completed
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        client_id,
        status: status || 'planning',
        priority: priority || 'medium',
        type: type || 'General',
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        budget: budget || 0,
        estimated_budget: estimated_budget || 0,
        actual_budget: actual_budget || 0,
        progress: progress || 0,
        manager,
        created_by,
        tasks_total: tasks_total || 0,
        tasks_completed: tasks_completed || 0,
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