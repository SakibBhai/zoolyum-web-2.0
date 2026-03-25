import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

// GET /api/admin/team-page - Get team page configuration
export async function GET() {
  try {
    const teamPage = await prisma.team_page.findFirst({
      where: { is_active: true },
      orderBy: { created_at: "desc" }
    });

    if (!teamPage) {
      // Return default configuration if none exists
      return NextResponse.json({
        hero_eyebrow: "Our Team",
        hero_title: "Meet the Strategists & Creatives",
        hero_description: "Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.",
        hero_image_url: "/placeholder.svg?height=600&width=1200",
        leadership_eyebrow: "Leadership",
        leadership_title: "Our Leadership Team",
        leadership_description: "Meet the visionaries guiding our agency's strategic direction and creative excellence.",
        team_eyebrow: "Our Experts",
        team_title: "The Full Zoolyum Team",
        team_description: "Our talented team of strategists, designers, and digital experts work collaboratively to deliver exceptional results.",
        culture_title: "Collaborative Innovation",
        culture_paragraph_1: "At Zoolyum, we foster a culture of collaborative innovation where diverse perspectives come together to create exceptional work.",
        culture_paragraph_2: "Our team is united by a passion for strategic thinking and creative excellence. We're curious, ambitious, and committed to continuous learning and growth.",
        culture_paragraph_3: "We're always looking for talented individuals who share our values and passion for transforming brands.",
        culture_image_url: "/placeholder.svg?height=600&width=500",
        cta_title: "Ready to Transform Your Brand?",
        cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
        cta_primary_text: "Start Your Project",
        cta_primary_url: "/contact",
        cta_secondary_text: "View Our Portfolio",
        cta_secondary_url: "/portfolio"
      });
    }

    return NextResponse.json(teamPage);
  } catch (error) {
    console.error("Error fetching team page:", error);
    return NextResponse.json(
      { error: "Failed to fetch team page configuration" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/team-page - Update team page configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (process.env.NODE_ENV === "production" && !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Check if a team page config exists
    const existing = await prisma.team_page.findFirst({
      where: { is_active: true }
    });

    let teamPage;

    if (existing) {
      // Update existing
      teamPage = await prisma.team_page.update({
        where: { id: existing.id },
        data: {
          hero_eyebrow: data.hero_eyebrow,
          hero_title: data.hero_title,
          hero_description: data.hero_description,
          hero_image_url: data.hero_image_url,
          leadership_eyebrow: data.leadership_eyebrow,
          leadership_title: data.leadership_title,
          leadership_description: data.leadership_description,
          team_eyebrow: data.team_eyebrow,
          team_title: data.team_title,
          team_description: data.team_description,
          culture_title: data.culture_title,
          culture_paragraph_1: data.culture_paragraph_1,
          culture_paragraph_2: data.culture_paragraph_2,
          culture_paragraph_3: data.culture_paragraph_3,
          culture_image_url: data.culture_image_url,
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
      teamPage = await prisma.team_page.create({
        data: {
          hero_eyebrow: data.hero_eyebrow,
          hero_title: data.hero_title,
          hero_description: data.hero_description,
          hero_image_url: data.hero_image_url,
          leadership_eyebrow: data.leadership_eyebrow,
          leadership_title: data.leadership_title,
          leadership_description: data.leadership_description,
          team_eyebrow: data.team_eyebrow,
          team_title: data.team_title,
          team_description: data.team_description,
          culture_title: data.culture_title,
          culture_paragraph_1: data.culture_paragraph_1,
          culture_paragraph_2: data.culture_paragraph_2,
          culture_paragraph_3: data.culture_paragraph_3,
          culture_image_url: data.culture_image_url,
          cta_title: data.cta_title,
          cta_description: data.cta_description,
          cta_primary_text: data.cta_primary_text,
          cta_primary_url: data.cta_primary_url,
          cta_secondary_text: data.cta_secondary_text,
          cta_secondary_url: data.cta_secondary_url,
        }
      });
    }

    // Revalidate the team page
    // Note: Next.js 15 doesn't have revalidatePath in server components, so we rely on client-side refresh

    return NextResponse.json(teamPage);
  } catch (error) {
    console.error("Error updating team page:", error);
    return NextResponse.json(
      { error: "Failed to update team page configuration" },
      { status: 500 }
    );
  }
}
