import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/jobs/[id]/apply/upload-cv - Upload CV for job application
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: jobId } = await params;
    const formData = await request.formData();
    const cvFile = formData.get('cv') as File;
    const applicantEmail = formData.get('email') as string;

    if (!cvFile) {
      return NextResponse.json(
        { error: 'CV file is required' },
        { status: 400 }
      );
    }

    if (!applicantEmail) {
      return NextResponse.json(
        { error: 'Applicant email is required' },
        { status: 400 }
      );
    }

    // Check if job exists and allows CV submission
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job || !job.published || !job.allowCvSubmission) {
      return NextResponse.json(
        { error: 'Job not found or CV submission not allowed' },
        { status: 404 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    const fileExtension = '.' + cvFile.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(cvFile.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (3MB limit)
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes
    if (cvFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 3MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedEmail = applicantEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const fileExtensionFromName = cvFile.name.split('.').pop();
    const filename = `cv_${jobId}_${sanitizedEmail}_${timestamp}.${fileExtensionFromName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the file URL
    const fileUrl = `/uploads/cvs/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'CV uploaded successfully',
      fileUrl,
      filename: cvFile.name,
      size: cvFile.size,
    });

  } catch (error) {
    console.error('CV upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload CV. Please try again.' },
      { status: 500 }
    );
  }
}