import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import { FileText, Briefcase, MessageSquare, Users } from "lucide-react"
import { prisma } from "@/lib/db"
import { DashboardStatsSkeleton } from "@/components/admin/dashboard-stats-skeleton"
import { RecentActivitySkeleton } from "@/components/admin/recent-activity-skeleton"

// Async component for fetching dashboard stats
async function DashboardStats() {
  const [postsCount, projectsCount, testimonialsCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.project.count(),
    prisma.testimonial.count()
  ])

  const stats = {
    posts: postsCount,
    projects: projectsCount,
    testimonials: testimonialsCount,
    visitors: 1024, // This would come from an analytics service in a real app
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Blog Posts"
        value={stats.posts}
        icon={<FileText className="h-6 w-6" />}
      />
      <StatCard
        title="Projects"
        value={stats.projects}
        icon={<Briefcase className="h-6 w-6" />}
      />
      <StatCard
        title="Testimonials"
        value={stats.testimonials}
        icon={<MessageSquare className="h-6 w-6" />}
      />
      <StatCard
        title="Visitors"
        value={stats.visitors}
        icon={<Users className="h-6 w-6" />}
      />
    </div>
  )
}

// Async component for recent activity
async function RecentActivity() {
  const recentPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      author: {
        select: {
          name: true
        }
      }
    }
  })

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-[#E9E7E2]">Recent Activity</h3>
      <div className="space-y-3">
        {recentPosts.map((post) => (
          <div key={post.id} className="flex items-center space-x-3 p-3 rounded-lg bg-[#252525]">
            <div className="w-2 h-2 bg-[#FF5001] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#E9E7E2]">{post.title}</p>
              <p className="text-xs text-[#E9E7E2]/60">
                Updated by {post.author?.name || 'Unknown'} • {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {recentPosts.length === 0 && (
          <p className="text-[#E9E7E2]/60 text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header renders immediately */}
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Dashboard</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Welcome back! Here's what's happening with your content.</p>
        </div>

        {/* Stats with Suspense boundary */}
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity with Suspense */}
          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
          
          {/* Quick Actions renders immediately */}
          <QuickActionsCard />
        </div>
      </div>
    </PageTransition>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#E9E7E2]/70">{title}</h3>
        <div className="p-2 bg-[#252525] rounded-lg text-[#FF5001]">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-[#E9E7E2]">{value}</p>
    </div>
  )
}



function QuickActionsCard() {
  const actions = [
    { id: 1, name: "Create Blog Post", href: "/admin/blog-posts/new", color: "bg-blue-500/10 text-blue-400" },
    { id: 2, name: "Add New Project", href: "/admin/projects/new", color: "bg-green-500/10 text-green-400" },
    {
      id: 3,
      name: "Add Testimonial",
      href: "/admin/testimonials/new",
      color: "bg-purple-500/10 text-purple-400",
    },
    { id: 4, name: "Update Profile", href: "/admin/settings", color: "bg-yellow-500/10 text-yellow-400" },
  ]

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`p-4 rounded-lg ${action.color} hover:opacity-80 transition-opacity flex items-center justify-center`}
          >
            {action.name}
          </a>
        ))}
      </div>
    </div>
  )
}
