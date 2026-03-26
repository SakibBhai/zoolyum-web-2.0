import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

// GET /api/admin/portfolio-page - Get portfolio page configuration
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
        cta_secondary_url: "/services"
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

// PUT /api/admin/portfolio-page - Update portfolio page configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (process.env.NODE_ENV === "production" && !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Check if a portfolio page config exists
    const existing = await prisma.portfolio_page.findFirst({
      where: { is_active: true }
    });

    let portfolioPage;

    if (existing) {
      // Update existing
      portfolioPage = await prisma.portfolio_page.update({
        where: { id: existing.id },
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
        }
      });
    } else {
      // Create new
      portfolioPage = await prisma.portfolio_page.create({
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
        }
      });
    }

    return NextResponse.json(portfolioPage);
  } catch (error) {
    console.error("Error updating portfolio page:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio page configuration" },
      { status: 500 }
    );
  }
}
