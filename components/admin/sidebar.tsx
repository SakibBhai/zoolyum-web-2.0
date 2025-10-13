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
  Megaphone,
  Mail,
  UserCheck
} from "lucide-react"
import { useConditionalUser } from "@/hooks/use-conditional-user"

interface AdminSidebarProps {
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebar({ isMobileMenuOpen = false, setIsMobileMenuOpen }: AdminSidebarProps) {
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
      name: "Jobs",
      href: "/admin/jobs",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: <Mail className="h-5 w-5" />
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

  const handleLinkClick = () => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#1A1A1A] border-r border-[#333333] min-h-screen p-4 flex-col">
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
                      : 'text-[#E9E7E2] hover:text-[#FFFFFF] hover:bg-[#252525]'}`}
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
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-[#E9E7E2] hover:text-[#FFFFFF] hover:bg-[#252525] transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-[#333333] transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 flex flex-col h-full">
          <div className="mb-8 px-2 pt-12">
            <h1 className="text-xl font-bold text-[#FF5001]">Zoolyum CMS</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors touch-manipulation ${isActive 
                        ? 'bg-[#FF5001]/10 text-[#FF5001]' 
                        : 'text-[#E9E7E2] hover:text-[#FFFFFF] hover:bg-[#252525]'}`}
                    >
                      {item.icon}
                      <span className="text-base">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-[#333333]">
            <button
              onClick={() => {
                window.location.href = "/handler/sign-out";
                handleLinkClick();
              }}
              className="flex items-center gap-3 px-3 py-3 w-full text-left rounded-md text-[#E9E7E2] hover:text-[#FFFFFF] hover:bg-[#252525] transition-colors touch-manipulation"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
