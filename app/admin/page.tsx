"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AdminPage() {
  const { data: session, status } = useSession()
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
      console.log('Development mode: Bypassing authentication in admin page')
      router.push("/admin/dashboard")
      return
    }

    // Still loading
    if (status === 'loading') return

    // Not authenticated - redirect to login
    if (status === 'unauthenticated') {
      router.push("/admin/login")
    } else if (status === 'authenticated') {
      // Redirect authenticated users to dashboard
      router.push("/admin/dashboard")
    }
  }, [status, router, isDevelopment])

  if (status === 'loading' && !isDevelopment) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    )
  }

  return null
}