"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useConditionalUser } from "@/hooks/use-conditional-user"

export default function AdminPage() {
  const user = useConditionalUser()
  const router = useRouter()
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    const isDevMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168') ||
                     window.location.port === '3000' ||
      window.location.port === '3001' ||
      window.location.port === '3002'
    setIsDevelopment(isDevMode)
  }, [])

  useEffect(() => {
    // In development, always redirect to dashboard
    if (isDevelopment) {
      console.log('Development mode: Bypassing Stack Auth in admin page')
      router.push("/admin/dashboard")
      return
    }
    
    if (user === undefined) return // Still loading
    
    if (!user) {
      router.push("/handler/sign-in")
    } else {
      // Redirect authenticated users to dashboard
      router.push("/admin/dashboard")
    }
  }, [user, router, isDevelopment])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    )
  }

  return null
}