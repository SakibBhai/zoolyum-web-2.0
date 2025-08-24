import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Validation schema for job application
const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional(),
  experience: z.string().optional(),
  availability: z.string().optional(),
  salaryExpectation: z.number().optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/jobs/[id]/apply - Submit job application
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: jobId } = await params;
    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // Check if job exists and is published
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || !job.published) {
      return NextResponse.json(
        { error: 'Job not found or not available for applications' },
        { status: 404 }
      );
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return NextResponse.json(
        { error: 'Application deadline has passed' },
        { status: 400 }
      );
    }

    // Enforce CV requirement and validate format when job requires CV submission
    if (job.allowCvSubmission) {
      if (!validatedData.resumeUrl) {
        return NextResponse.json(
          { error: 'CV/Resume is required for this application' },
          { status: 400 }
        );
      }
      const lowerUrl = validatedData.resumeUrl.toLowerCase();
      if (!/(\.pdf|\.doc|\.docx)$/.test(lowerUrl)) {
        return NextResponse.json(
          { error: 'Invalid resume format. Allowed formats: PDF, DOC, DOCX' },
          { status: 400 }
        );
      }
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        email: validatedData.email,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create job application
    const application = await prisma.jobApplication.create({
      data: {
        ...validatedData,
        jobId,
        ipAddress,
        userAgent,
      },
    });

    // Send confirmation email to applicant
    if (resend) {
      try {
        await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@featuresdigital.com',
        to: validatedData.email,
        subject: `Application Received - ${job.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for your application!</h2>
            <p>Dear ${validatedData.firstName} ${validatedData.lastName},</p>
            <p>We have received your application for the <strong>${job.title}</strong> position at Features Digital Branding & Marketing Agency.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Application Details:</h3>
              <p><strong>Position:</strong> ${job.title}</p>
              <p><strong>Department:</strong> ${job.department}</p>
              <p><strong>Location:</strong> ${job.location}</p>
              <p><strong>Application ID:</strong> ${application.id}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>Our team will review your application and get back to you within 5-7 business days.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Features Digital Team</p>
          </div>
        `,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the application if email fails
      }

      // Send notification email to HR/Admin
      try {
        const hrEmail = process.env.HR_EMAIL || process.env.ADMIN_EMAIL;
        if (hrEmail) {
          await resend.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@featuresdigital.com',
          to: hrEmail,
          subject: `New Job Application - ${job.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Job Application Received</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">Application Details:</h3>
                <p><strong>Position:</strong> ${job.title}</p>
                <p><strong>Applicant:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
                <p><strong>Application ID:</strong> ${application.id}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              ${validatedData.resumeUrl ? `<p><strong>Resume:</strong> <a href="${validatedData.resumeUrl}">View Resume</a></p>` : ''}
              ${validatedData.portfolioUrl ? `<p><strong>Portfolio:</strong> <a href="${validatedData.portfolioUrl}">View Portfolio</a></p>` : ''}
              ${validatedData.linkedinUrl ? `<p><strong>LinkedIn:</strong> <a href="${validatedData.linkedinUrl}">View Profile</a></p>` : ''}
              ${validatedData.coverLetter ? `
                <div style="margin-top: 20px;">
                  <h4>Cover Letter:</h4>
                  <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
                    ${validatedData.coverLetter.replace(/\n/g, '<br>')}
                  </div>
                </div>
              ` : ''}
              <p><a href="${process.env.NEXTAUTH_URL}/admin/applications/${application.id}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Application</a></p>
            </div>
          `,
          });
        }
      } catch (emailError) {
        console.error('Failed to send HR notification email:', emailError);
        // Don't fail the application if email fails
      }
    }

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error submitting job application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}