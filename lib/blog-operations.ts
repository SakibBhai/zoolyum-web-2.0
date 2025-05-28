import { getBrowserClient } from "./supabase"

export async function fetchBlogPosts() {
  const supabase = getBrowserClient()

  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    throw error
  }

  return data
}

export async function fetchBlogPost(slug: string) {
  const supabase = getBrowserClient()

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    throw error
  }

  return data
}

export async function createBlogPost(postData: any) {
  const supabase = getBrowserClient()

  // Process tags if they're a comma-separated string
  if (typeof postData.tags === "string") {
    postData.tags = postData.tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean)
  }

  // First, check if the admin user exists in the admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", postData.author_id)
    .single()

  if (adminError || !adminUser) {
    console.error("Admin user not found in admin_users table. Attempting to create entry.", adminError)

    // Get user details from auth
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      throw new Error("Could not retrieve user information")
    }

    // Create an entry in the admin_users table
    const { error: insertError } = await supabase.from("admin_users").insert([
      {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.email?.split("@")[0] || "Admin User",
        role: "admin",
      },
    ])

    if (insertError) {
      console.error("Error creating admin user entry:", insertError)
      throw new Error("Failed to create admin user record. Please complete the admin registration process.")
    }

    // Use the newly created admin user ID
    postData.author_id = userData.user.id
  }

  const { data, error } = await supabase.from("blog_posts").insert([postData]).select()

  if (error) {
    console.error("Error creating blog post:", error)
    throw error
  }

  return data[0]
}

export async function updateBlogPost(id: number, postData: any) {
  const supabase = getBrowserClient()

  // Process tags if they're a comma-separated string
  if (typeof postData.tags === "string") {
    postData.tags = postData.tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean)
  }

  const { data, error } = await supabase.from("blog_posts").update(postData).eq("id", id).select()

  if (error) {
    console.error(`Error updating blog post with id ${id}:`, error)
    throw error
  }

  return data[0]
}

export async function deleteBlogPost(id: number) {
  const supabase = getBrowserClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting blog post with id ${id}:`, error)
    throw error
  }

  return true
}
