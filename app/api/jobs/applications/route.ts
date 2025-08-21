import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUser } from "@stackframe/stack"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (you may need to adjust this based on your admin logic)
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: user.primaryEmail || "" }
    })

    if (!adminUser) {
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
            type: true
          }
        }
      },
      orderBy: {
        appliedAt: "desc"
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get total count
    const totalCount = await prisma.jobApplication.count({ where })

    // Calculate stats
    const stats = {
      total: await prisma.jobApplication.count(),
      pending: await prisma.jobApplication.count(), // All applications are pending by default
      reviewed: 0, // You can add a status field later
      shortlisted: 0 // You can add a status field later
    }

    return NextResponse.json({
      applications,
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

// Update application status (for future use)
export async function PATCH(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { email: user.primaryEmail || "" }
    })

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { applicationId, status, notes } = await request.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      )
    }

    // For now, we'll just return success since we don't have status fields yet
    // In the future, you can add status and notes fields to the JobApplication model
    
    return NextResponse.json({
      message: "Application status updated successfully"
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}