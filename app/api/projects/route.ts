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
    console.log('Received project data:', body);
    
    // Handle both admin form structure and direct API calls
    const {
      title,
      name,
      slug,
      description,
      category,
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

    // Use title if provided (from admin form), otherwise use name
    const projectName = title || name;
    const projectType = category || type || 'General';

    // Validate required fields
    if (!projectName) {
      return NextResponse.json(
        { error: 'Missing required field: title/name' },
        { status: 400 }
      );
    }

    // UUID validation helper
    const isValidUUID = (uuid: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    };

    // Validate UUID fields
    if (client_id && !isValidUUID(client_id)) {
      return NextResponse.json(
        { error: 'Invalid client_id: must be a valid UUID' },
        { status: 400 }
      );
    }

    if (created_by && !isValidUUID(created_by)) {
      return NextResponse.json(
        { error: 'Invalid created_by: must be a valid UUID' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: projectName,
        description,
        client_id: client_id || null,
        status: status || 'planning',
        priority: priority || 'medium',
        type: projectType,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        budget: budget || 0,
        estimated_budget: estimated_budget || 0,
        actual_budget: actual_budget || 0,
        progress: progress || 0,
        manager,
        created_by: created_by || null,
        tasks_total: tasks_total || 0,
        tasks_completed: tasks_completed || 0,
      },
    });

    console.log('Project created successfully:', project);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}