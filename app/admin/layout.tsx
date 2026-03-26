'use client';

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    const isDevMode = process.env.NODE_ENV === "development" ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168') ||
                     window.location.port === '3000' ||
                     window.location.port === '3001' ||
                     window.location.port === '3002'
    setIsDevelopment(isDevMode)
  }, [])

  useEffect(() => {
    // Skip authentication check in development
    if (isDevelopment) {
      console.log('Development mode: Bypassing authentication in admin layout')
      return
    }

    // Handle session errors gracefully
    try {
      // Still loading session
      if (status === 'loading') return

      // Not authenticated
      if (status === 'unauthenticated') {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error('Session error in admin layout:', error)
      setSessionError(true)
    }
  }, [session, status, router, isDevelopment])

  // Loading state
  if (status === 'loading' && !isDevelopment && !sessionError) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    )
  }

  // In development, authenticated, or session error, show admin interface
  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#1A1A1A] text-[#E9E7E2] hover:bg-[#252525]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 transition-all duration-300">
        <div className="p-4 sm:p-6 pt-16 lg:pt-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
