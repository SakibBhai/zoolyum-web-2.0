import { getBrowserClient } from "./supabase"

export async function fetchProjects() {
  const supabase = getBrowserClient()

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }

  return data
}

export async function fetchProject(slug: string) {
  const supabase = getBrowserClient()

  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    throw error
  }

  return data
}

export async function createProject(projectData: any) {
  const supabase = getBrowserClient()

  // Process services if they're a comma-separated string
  if (typeof projectData.services === "string") {
    projectData.services = projectData.services
      .split(",")
      .map((service: string) => service.trim())
      .filter(Boolean)
  }

  // Process JSON fields
  const jsonFields = ["process", "gallery", "results", "testimonial"]
  jsonFields.forEach((field) => {
    if (typeof projectData[field] === "string" && projectData[field].trim() !== "") {
      try {
        projectData[field] = JSON.parse(projectData[field])
      } catch (e) {
        console.error(`Error parsing JSON for ${field}:`, e)
        projectData[field] = field === "testimonial" ? {} : []
      }
    }
  })

  const { data, error } = await supabase.from("projects").insert([projectData]).select()

  if (error) {
    console.error("Error creating project:", error)
    throw error
  }

  return data[0]
}

export async function updateProject(id: number, projectData: any) {
  const supabase = getBrowserClient()

  // Process services if they're a comma-separated string
  if (typeof projectData.services === "string") {
    projectData.services = projectData.services
      .split(",")
      .map((service: string) => service.trim())
      .filter(Boolean)
  }

  // Process JSON fields
  const jsonFields = ["process", "gallery", "results", "testimonial"]
  jsonFields.forEach((field) => {
    if (typeof projectData[field] === "string" && projectData[field].trim() !== "") {
      try {
        projectData[field] = JSON.parse(projectData[field])
      } catch (e) {
        console.error(`Error parsing JSON for ${field}:`, e)
        // Keep the field as is if parsing fails
      }
    }
  })

  const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select()

  if (error) {
    console.error(`Error updating project with id ${id}:`, error)
    throw error
  }

  return data[0]
}

export async function deleteProject(id: number) {
  const supabase = getBrowserClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting project with id ${id}:`, error)
    throw error
  }

  return true
}
