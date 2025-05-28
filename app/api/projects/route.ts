import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.category || !data.description || !data.thumbnail_url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingProject } = await supabase.from("projects").select("slug").eq("slug", data.slug).single()

    if (existingProject) {
      return NextResponse.json({ message: "A project with this slug already exists" }, { status: 400 })
    }

    // Insert project
    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
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
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
