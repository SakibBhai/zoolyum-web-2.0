import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, userId, isFirstAdmin } = await request.json()

    // Create server client with admin privileges
    const supabase = createServerClient()

    // Insert the user into our admin_users table
    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          id: userId,
          email,
          name,
          role: isFirstAdmin ? "admin" : "editor", // First user is admin, others are editors
        },
      ])
      .select()

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data[0] })
  } catch (err: any) {
    console.error("Error in admin signup:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
