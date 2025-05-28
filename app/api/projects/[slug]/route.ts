import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    const { slug } = params

    const { data: project, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ message: "Project not found" }, { status: 404 })
      }

      console.error("Error fetching project:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    const { slug } = params
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.category || !data.description || !data.thumbnail_url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if new slug already exists (if slug is being changed)
    if (data.slug !== slug) {
      const { data: existingProject } = await supabase.from("projects").select("slug").eq("slug", data.slug).single()

      if (existingProject) {
        return NextResponse.json({ message: "A project with this slug already exists" }, { status: 400 })
      }
    }

    // Update project
    const { data: project, error } = await supabase
      .from("projects")
      .update({
        title: data.title,
        slug: data.slug,
        category: data.category,
        client: data.client || null,
        year: data.year || null,
        duration: data.duration || null,
        description: data.description,
        overview: data.overview || null,
        challenge: data.challenge || null,
        solution: data.solution || null,
        thumbnail_url: data.thumbnail_url,
        hero_image_url: data.hero_image_url || null,
        process: data.process || [],
        gallery: data.gallery || [],
        results: data.results || [],
        testimonial: data.testimonial || null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .select()
      .single()

    if (error) {
      console.error("Error updating project:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    const { slug } = params

    const { error } = await supabase.from("projects").delete().eq("slug", slug)

    if (error) {
      console.error("Error deleting project:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
