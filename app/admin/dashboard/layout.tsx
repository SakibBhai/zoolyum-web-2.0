"use client"

import { type ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Settings, LogOut, Menu, X, User, Mail, Megaphone } from "lucide-react"
import { useConditionalUser } from "@/hooks/use-conditional-user"
import { AdminLoading } from "@/components/admin/admin-loading"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const user = useConditionalUser()

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
      console.log('Development mode: Bypassing Stack Auth in dashboard layout')
      return
    }
    
    if (user === null) {
      router.push("/handler/sign-in")
    }
  }, [user, router, isDevelopment])

  // In development, create a mock user
  const effectiveUser = isDevelopment ? {
    displayName: 'Development Admin',
    primaryEmail: 'admin@zoolyum.com'
  } : user

  if (!isDevelopment && user === undefined) {
    return <AdminLoading />
  }

  if (!isDevelopment && !user) {
    return null // Or a loading spinner, or redirect
  }

  const handleSignOut = async () => {
    window.location.href = "/handler/sign-out"
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Blog Posts",
      href: "/admin/blog-posts",
      icon: FileText
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: Briefcase
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: FileText
    },
    {
      name: "Team Members",
      href: "/admin/team",
      icon: User
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquare
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: Mail
    },
    {
      name: "Campaigns",
      href: "/admin/campaigns",
      icon: Megaphone
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ]

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-[#1A1A1A] text-[#E9E7E2]">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1A1A1A] border-r border-[#333333] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#333333]">
          <Link href="/admin/dashboard" className="text-[#FF5001] font-bold text-xl">
            Admin Panel
          </Link>
        </div>

        {/* Admin user info */}
        {effectiveUser && (
          <div className="p-4 border-b border-[#333333]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-[#FF5001]">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{effectiveUser.displayName}</p>
                <p className="text-xs text-[#E9E7E2]/50">{effectiveUser.primaryEmail}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#FF5001]/10 text-[#FF5001]"
                    : "text-[#E9E7E2]/70 hover:bg-[#252525] hover:text-[#E9E7E2]"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333333]">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-[#E9E7E2]/70 hover:bg-[#252525] hover:text-[#E9E7E2] rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
