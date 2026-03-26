import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/portfolio-page - Get portfolio page configuration
// Public endpoint - no authentication required for read access
export async function GET() {
  try {
    const portfolioPage = await prisma.portfolio_page.findFirst({
      where: { is_active: true },
      orderBy: { created_at: "desc" }
    });

    if (!portfolioPage) {
      // Return default configuration if none exists
      return NextResponse.json({
        hero_eyebrow: "Our Portfolio",
        hero_title: "Strategic Brand Transformations",
        hero_description: "Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence.",
        featured_eyebrow: "Featured Project",
        featured_title: "Featured Work",
        featured_description: "Highlighting our most impactful work that showcases our expertise and creativity.",
        cta_title: "Ready to Transform Your Brand?",
        cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
        cta_primary_text: "Start Your Project",
        cta_primary_url: "/contact",
        cta_secondary_text: "Explore Our Services",
        cta_secondary_url: "/services",
        is_active: true
      });
    }

    return NextResponse.json(portfolioPage);
  } catch (error) {
    console.error("Error fetching portfolio page:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio page configuration" },
      { status: 500 }
    );
  }
}

// POST /api/admin/portfolio-page - Create portfolio page configuration
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Deactivate all existing portfolio pages
    await prisma.portfolio_page.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    });

    // Create new portfolio page
    const portfolioPage = await prisma.portfolio_page.create({
      data: {
        hero_eyebrow: data.hero_eyebrow,
        hero_title: data.hero_title,
        hero_description: data.hero_description,
        featured_eyebrow: data.featured_eyebrow,
        featured_title: data.featured_title,
        featured_description: data.featured_description,
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
      message: "Portfolio page created successfully",
      portfolioPage
    });
  } catch (error) {
    console.error("Error creating portfolio page:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio page configuration" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/portfolio-page - Update portfolio page configuration
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, created_at, updated_at, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio page ID is required" },
        { status: 400 }
      );
    }

    // Update portfolio page
    const portfolioPage = await prisma.portfolio_page.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: "Portfolio page updated successfully",
      portfolioPage
    });
  } catch (error) {
    console.error("Error updating portfolio page:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio page configuration" },
      { status: 500 }
    );
  }
}
