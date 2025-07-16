'use client';

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { useUser } from "@stackframe/stack"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return // Still loading
    
    if (!user) {
      router.push("/handler/sign-in")
    }
  }, [user, router])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  
  return (
    <div className="flex min-h-screen bg-[#121212]">
      {user && (
        <AdminSidebar />
      )}
      <main className={`flex-1 p-6 overflow-auto ${user ? "" : ""}`}>
        {children}
      </main>
    </div>
  )
}
