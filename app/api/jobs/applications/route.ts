import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, isAdmin } from "@/lib/stack-auth"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authorized = await isAdmin()
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const jobId = searchParams.get("jobId")
    const status = searchParams.get("status")

    // Build where clause
    const where: any = {}
    if (jobId) {
      where.jobId = jobId
    }
    if (status) {
      where.status = status
    }

    // Get applications with job details
    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            type: true,
          }
        }
      },
      orderBy: {
        created_at: "desc"
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Shape response for admin UI expectations
    const shaped = applications.map((app) => ({
      id: app.id,
      fullName: app.name,
      email: app.email,
      phone: app.phone ?? null,
      resumeUrl: app.resume_url ?? null,
      coverLetter: app.cover_letter ?? null,
      appliedAt: app.created_at,
      job: {
        id: app.job.id,
        title: app.job.title,
        department: app.job.department,
        location: app.job.location,
        type: app.job.type,
      }
    }))

    // Get total count
    const totalCount = await prisma.jobApplication.count({ where })

    // Calculate stats
    const stats = {
      total: await prisma.jobApplication.count(),
      pending: await prisma.jobApplication.count({ where: { status: "pending" } }),
      reviewed: await prisma.jobApplication.count({ where: { status: "reviewed" } }),
      shortlisted: await prisma.jobApplication.count({ where: { status: "shortlisted" } })
    }

    return NextResponse.json({
      applications: shaped,
      stats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching job applications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update application status
export async function PATCH(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authorized = await isAdmin()
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const schema = z.object({
      applicationId: z.string().min(1, "applicationId is required"),
      status: z.enum(["pending", "reviewed", "shortlisted"]).optional()
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { applicationId, status } = parsed.data

    if (status) {
      const updated = await prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status },
        include: {
          job: {
            select: { id: true, title: true, department: true, location: true, type: true }
          }
        }
      })

      const shaped = {
        id: updated.id,
        fullName: updated.name,
        email: updated.email,
        phone: updated.phone ?? null,
        resumeUrl: updated.resume_url ?? null,
        coverLetter: updated.cover_letter ?? null,
        appliedAt: updated.created_at,
        job: {
          id: updated.job.id,
          title: updated.job.title,
          department: updated.job.department,
          location: updated.job.location,
          type: updated.job.type,
        }
      }

      return NextResponse.json({ message: "Application updated", application: shaped })
    }

    return NextResponse.json({ message: "No changes requested" })
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}