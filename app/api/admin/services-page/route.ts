import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/services-page - Get services page configuration
// Public endpoint - no authentication required for read access
export async function GET() {
  try {
    const servicesPage = await prisma.services_page.findFirst({
      where: { is_active: true },
      orderBy: { created_at: "desc" }
    });

    if (!servicesPage) {
      // Return default configuration if none exists
      return NextResponse.json({
        hero_eyebrow: "Our Services",
        hero_title: "Strategic Solutions for Modern Brands",
        hero_description: "We offer comprehensive services to elevate your brand and drive business growth through strategic thinking and creative excellence.",
        hero_image_url: "/placeholder.svg?height=600&width=1200",
        services_eyebrow: "What We Do",
        services_title: "Our Core Services",
        services_description: "From brand strategy to digital transformation, we provide end-to-end solutions that deliver measurable results.",
        cta_title: "Ready to Grow Your Business?",
        cta_description: "Let's collaborate to create a tailored strategy that drives real results for your business.",
        cta_primary_text: "Start Your Project",
        cta_primary_url: "/contact",
        cta_secondary_text: "View Our Work",
        cta_secondary_url: "/portfolio",
        is_active: true
      });
    }

    return NextResponse.json(servicesPage);
  } catch (error) {
    console.error("Error fetching services page:", error);
    return NextResponse.json(
      { error: "Failed to fetch services page configuration" },
      { status: 500 }
    );
  }
}

// POST /api/admin/services-page - Create services page configuration
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Deactivate all existing services pages
    await prisma.services_page.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    });

    // Create new services page
    const servicesPage = await prisma.services_page.create({
      data: {
        hero_eyebrow: data.hero_eyebrow,
        hero_title: data.hero_title,
        hero_description: data.hero_description,
        hero_image_url: data.hero_image_url,
        services_eyebrow: data.services_eyebrow,
        services_title: data.services_title,
        services_description: data.services_description,
        cta_title: data.cta_title,
        cta_description: data.cta_description,
        cta_primary_text: data.cta_primary_text,
        cta_primary_url: data.cta_primary_url,
        cta_secondary_text: data.cta_secondary_text,
        cta_secondary_url: data.cta_secondary_url,
        is_active: true
      }
    });

    return NextResponse.json({
      message: "Services page created successfully",
      servicesPage
    });
  } catch (error) {
    console.error("Error creating services page:", error);
    return NextResponse.json(
      { error: "Failed to create services page configuration" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services-page - Update services page configuration
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, created_at, updated_at, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Services page ID is required" },
        { status: 400 }
      );
    }

    // Update services page
    const servicesPage = await prisma.services_page.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: "Services page updated successfully",
      servicesPage
    });
  } catch (error) {
    console.error("Error updating services page:", error);
    return NextResponse.json(
      { error: "Failed to update services page configuration" },
      { status: 500 }
    );
  }
}
