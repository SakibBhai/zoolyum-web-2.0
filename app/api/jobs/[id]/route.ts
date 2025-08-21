import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/stack-auth';

// Validation schema for job updates
const jobUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  department: z.string().min(1, 'Department is required').max(100).optional(),
  location: z.string().min(1, 'Location is required').max(100).optional(),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).optional(),
  employmentType: z.enum(['Remote', 'On-site', 'Hybrid']).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  description: z.string().min(1, 'Description is required').optional(),
  requirements: z.string().min(1, 'Requirements are required').optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required').optional(),
  perks: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  applicationDeadline: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/jobs/[id] - Fetch a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // If job is not published, only allow admin access
    if (!job.published) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      const adminUser = await prisma.adminUser.findUnique({
        where: { email: user.email || user.primaryEmail || '' },
      });

      if (!adminUser) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update a job (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: user.email || user.primaryEmail || '' },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validatedData = jobUpdateSchema.parse(body);

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Update slug if title is being updated
    let updateData: any = { ...validatedData };
    if (validatedData.title) {
      const newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug conflicts with existing jobs (excluding current job)
      const slugConflict = await prisma.job.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A job with this title already exists' },
          { status: 400 }
        );
      }

      updateData.slug = newSlug;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: user.email || user.primaryEmail || '' },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if job has applications
    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete job with existing applications. Consider unpublishing instead.',
          applicationsCount: existingJob._count.applications 
        },
        { status: 400 }
      );
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}