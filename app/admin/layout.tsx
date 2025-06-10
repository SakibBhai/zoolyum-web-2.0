"use client"

import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { useSession } from "next-auth/react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  return (
    <div className="flex min-h-screen bg-[#121212]">
      {status === "authenticated" && session?.user && (
        <AdminSidebar />
      )}
      <main className={`flex-1 p-6 overflow-auto ${status === "authenticated" ? "" : ""}`}>
        {children}
      </main>
    </div>
  )
}
