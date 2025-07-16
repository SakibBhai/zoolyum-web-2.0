'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  MessageSquare,
  Settings,
  LogOut,
  Megaphone
} from "lucide-react"
import { useUser } from "@stackframe/stack"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Blog Posts",
      href: "/admin/blog-posts",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Team Members",
      href: "/admin/team",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: "Campaigns",
      href: "/admin/campaigns",
      icon: <Megaphone className="h-5 w-5" />
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ]

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-[#333333] min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-[#FF5001]">Zoolyum CMS</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive 
                    ? 'bg-[#FF5001]/10 text-[#FF5001]' 
                    : 'text-[#E9E7E2]/70 hover:text-[#E9E7E2] hover:bg-[#252525]'}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-[#333333]">
        <button
          onClick={() => window.location.href = "/handler/sign-out"}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-[#E9E7E2]/70 hover:text-[#E9E7E2] hover:bg-[#252525] transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}