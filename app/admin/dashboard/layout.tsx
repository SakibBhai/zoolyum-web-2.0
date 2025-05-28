"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Settings, LogOut, Menu, X, User } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { signOut, adminUser, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/admin/dashboard/blog", icon: FileText },
    { name: "Projects", href: "/admin/dashboard/projects", icon: Briefcase },
    { name: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

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
        {adminUser && (
          <div className="p-4 border-b border-[#333333]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-[#FF5001]">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{adminUser.name}</p>
                <p className="text-xs text-[#E9E7E2]/50">{adminUser.role}</p>
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
      <div className="flex-1 md:ml-64">
        <main className="p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
