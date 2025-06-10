import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Briefcase, MessageSquare, Users } from "lucide-react"

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { title: "Blog Posts", icon: FileText },
        { title: "Projects", icon: Briefcase },
        { title: "Testimonials", icon: MessageSquare },
        { title: "Visitors", icon: Users }
      ].map(({ title, icon: Icon }) => (
        <div key={title} className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-20" />
            <div className="p-2 bg-[#252525] rounded-lg text-[#FF5001]">
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}