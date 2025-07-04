import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock settings - in a real app, fetch from database
    const settings = {
      siteName: "Zoolyum",
      siteDescription: "Creative Design Studio",
      contactEmail: "hello@zoolyum.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Creative Street, Design City, DC 12345",
      logo: "",
      socialLinks: {
        twitter: "https://twitter.com/zoolyum",
        facebook: "https://facebook.com/zoolyum",
        instagram: "https://instagram.com/zoolyum",
        linkedin: "https://linkedin.com/company/zoolyum",
      },
      appearance: {
        primaryColor: "#FF5001",
        darkMode: false,
      },
      seo: {
        metaTitle: "Zoolyum - Creative Design Studio",
        metaDescription: "We create amazing digital experiences",
        keywords: ["design", "creative", "studio"],
      },
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    // Validate the settings data based on type
    if (type === "general") {
      if (!data.siteName || !data.siteDescription) {
        return NextResponse.json(
          { error: "Site name and description are required" },
          { status: 400 }
        );
      }
    }

    // In a real app, save to database based on type
    // For now, just return success
    console.log(`Updating ${type} settings:`, data);

    return NextResponse.json({
      success: true,
      message: `${type} settings updated successfully`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
