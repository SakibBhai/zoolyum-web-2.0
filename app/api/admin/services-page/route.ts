import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

// GET /api/admin/services-page - Get services page configuration
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
        cta_secondary_url: "/portfolio"
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

// PUT /api/admin/services-page - Update services page configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (process.env.NODE_ENV === "production" && !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Check if a services page config exists
    const existing = await prisma.services_page.findFirst({
      where: { is_active: true }
    });

    let servicesPage;

    if (existing) {
      // Update existing
      servicesPage = await prisma.services_page.update({
        where: { id: existing.id },
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
        }
      });
    } else {
      // Create new
      servicesPage = await prisma.services_page.create({
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
        }
      });
    }

    return NextResponse.json(servicesPage);
  } catch (error) {
    console.error("Error updating services page:", error);
    return NextResponse.json(
      { error: "Failed to update services page configuration" },
      { status: 500 }
    );
  }
}
