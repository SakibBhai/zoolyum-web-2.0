import type { ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata = {
  title: "Admin Dashboard | Sakib Chowdhury",
  description: "Admin dashboard for managing website content",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
