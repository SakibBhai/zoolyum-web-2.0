import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Count users with ADMIN role
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });

    return NextResponse.json({ isFirstAdmin: adminCount === 0 });
  } catch (error) {
    console.error("Error checking admin users:", error);
    return NextResponse.json(
      { error: "Failed to check admin users" },
      { status: 500 }
    );
  }
}