"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase"
import { PageTransition } from "@/components/page-transition"
import { AlertCircle } from "lucide-react"

export default function AdminSignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstAdmin, setIsFirstAdmin] = useState(true) // Assume it's the first admin until we check
  const router = useRouter()

  // Check if there are any existing admins
  const checkExistingAdmins = async () => {
    try {
      const supabase = getBrowserClient()
      const { count, error } = await supabase.from("admin_users").select("*", { count: "exact", head: true })

      if (error) {
        console.error("Error checking admin users:", error)
        return
      }

      setIsFirstAdmin(count === 0)
    } catch (err) {
      console.error("Error checking admin users:", err)
    }
  }

  // Check on component mount
  useEffect(() => {
    checkExistingAdmins()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getBrowserClient()

      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // 2. Call our API route to insert the admin user
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email,
          name,
          isFirstAdmin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user")
      }

      // 3. Redirect to login page
      router.push("/admin/login")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[#1A1A1A] rounded-2xl border border-[#333333]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Signup</h1>
            <p className="text-[#E9E7E2]/70">
              {isFirstAdmin ? "Create the first admin account" : "Sign up for an admin account (requires approval)"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center text-red-400">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-[#E9E7E2]/50">Password must be at least 8 characters long</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
