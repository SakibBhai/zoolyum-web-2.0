import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/testimonials-page - Get testimonials page configuration
// Public endpoint - no authentication required for read access
export async function GET() {
  try {
    const testimonialsPage = await prisma.testimonials_page.findFirst({
      where: { is_active: true },
      orderBy: { created_at: "desc" }
    });

    if (!testimonialsPage) {
      // Return default configuration if none exists
      return NextResponse.json({
        hero_eyebrow: "Client Stories",
        hero_title: "Transformative Success Stories",
        hero_description: "Hear from the brands and businesses that have experienced the transformative power of our strategic approach and creative excellence.",
        stats_eyebrow: "Results",
        stats_title: "Measurable Business Impact",
        stats_description: "Our strategic approach delivers tangible results for our clients across various metrics.",
        cta_title: "Ready to Join Our Success Stories?",
        cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives results.",
        cta_primary_text: "Start Your Project",
        cta_primary_url: "/contact",
        is_active: true
      });
    }

    return NextResponse.json(testimonialsPage);
  } catch (error) {
    console.error("Error fetching testimonials page:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials page configuration" },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials-page - Create testimonials page configuration
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Deactivate all existing testimonials pages
    await prisma.testimonials_page.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    });

    // Create new testimonials page
    const testimonialsPage = await prisma.testimonials_page.create({
      data: {
        hero_eyebrow: data.hero_eyebrow,
        hero_title: data.hero_title,
        hero_description: data.hero_description,
        stats_eyebrow: data.stats_eyebrow,
        stats_title: data.stats_title,
        stats_description: data.stats_description,
        cta_title: data.cta_title,
        cta_description: data.cta_description,
        cta_primary_text: data.cta_primary_text,
        cta_primary_url: data.cta_primary_url,
        is_active: true
      }
    });

    return NextResponse.json({
      message: "Testimonials page created successfully",
      testimonialsPage
    });
  } catch (error) {
    console.error("Error creating testimonials page:", error);
    return NextResponse.json(
      { error: "Failed to create testimonials page configuration" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/testimonials-page - Update testimonials page configuration
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, created_at, updated_at, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Testimonials page ID is required" },
        { status: 400 }
      );
    }

    // Update testimonials page
    const testimonialsPage = await prisma.testimonials_page.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: "Testimonials page updated successfully",
      testimonialsPage
    });
  } catch (error) {
    console.error("Error updating testimonials page:", error);
    return NextResponse.json(
      { error: "Failed to update testimonials page configuration" },
      { status: 500 }
    );
  }
}
