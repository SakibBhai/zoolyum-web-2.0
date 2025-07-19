'use client';

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { useConditionalUser } from "@/hooks/use-conditional-user"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useConditionalUser()
  const router = useRouter()
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    const isDevMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168') ||
                     window.location.port === '3000' ||
                     window.location.port === '3001'
    setIsDevelopment(isDevMode)
  }, [])

  useEffect(() => {
    // Skip authentication check in development
    if (isDevelopment) {
      console.log('Development mode: Bypassing Stack Auth in admin layout')
      return
    }
    
    if (user === undefined) return // Still loading
    
    if (!user) {
      router.push("/handler/sign-in")
    }
  }, [user, router, isDevelopment])

  // In development, always show the admin interface
  if (isDevelopment) {
    return (
      <div className="flex min-h-screen bg-[#121212]">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

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
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
