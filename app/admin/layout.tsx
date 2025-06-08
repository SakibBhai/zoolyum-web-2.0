import type { ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin Dashboard | Zoolyum CMS",
  description: "Admin dashboard for managing website content",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#121212]">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
