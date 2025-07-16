"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@stackframe/stack"

export default function AdminPage() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return // Still loading
    
    if (!user) {
      router.push("/handler/sign-in")
    } else {
      // Redirect authenticated users to dashboard
      router.push("/admin/dashboard")
    }
  }, [user, router])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    )
  }

  return null
}