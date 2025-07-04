import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  validateTestimonialData,
} from "@/lib/testimonial-operations";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/testimonials/[id] - Get single testimonial
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Check if user is admin for non-approved testimonials
    const session = await getServerSession(authOptions);
    const isAdmin = !!session?.user;

    if (!testimonial.approved && !isAdmin) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update testimonial
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Validate the data
    const validation = validateTestimonialData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const existingTestimonial = await getTestimonialById(id);
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Update the testimonial
    const updatedTestimonial = await updateTestimonial(id, body);

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if testimonial exists
    const existingTestimonial = await getTestimonialById(id);
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Delete the testimonial
    await deleteTestimonial(id);

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
