"use client"

import { useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase"
import { PageTransition } from "@/components/page-transition"
import { FileText, Briefcase, MessageSquare, Users } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    projects: 0,
    testimonials: 0,
    visitors: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getBrowserClient()

        // These would be actual queries to your Supabase tables
        // For now, we'll use placeholder data

        // const { count: postsCount } = await supabase
        //   .from('posts')
        //   .select('*', { count: 'exact', head: true })

        // Simulating data fetch
        setTimeout(() => {
          setStats({
            posts: 6,
            projects: 8,
            testimonials: 12,
            visitors: 1024,
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <PageTransition>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Blog Posts"
            value={stats.posts}
            icon={<FileText className="h-6 w-6" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<Briefcase className="h-6 w-6" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Testimonials"
            value={stats.testimonials}
            icon={<MessageSquare className="h-6 w-6" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Visitors"
            value={stats.visitors}
            icon={<Users className="h-6 w-6" />}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityCard isLoading={isLoading} />
          <QuickActionsCard />
        </div>
      </div>
    </PageTransition>
  )
}

function StatCard({ title, value, icon, isLoading }) {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#E9E7E2]/70">{title}</h3>
        <div className="p-2 bg-[#252525] rounded-lg text-[#FF5001]">{icon}</div>
      </div>
      {isLoading ? (
        <div className="h-8 w-20 bg-[#252525] rounded animate-pulse"></div>
      ) : (
        <p className="text-3xl font-bold">{value}</p>
      )}
    </div>
  )
}

function RecentActivityCard({ isLoading }) {
  const activities = [
    { id: 1, action: "New blog post published", time: "2 hours ago" },
    { id: 2, action: 'Project "Nexus Rebrand" updated', time: "1 day ago" },
    { id: 3, action: "New testimonial added", time: "3 days ago" },
    { id: 4, action: "Website settings updated", time: "1 week ago" },
  ]

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-[#252525] rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#252525] rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-[#252525] rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#FF5001] mr-3"></div>
              <div>
                <p className="text-[#E9E7E2]">{activity.action}</p>
                <p className="text-sm text-[#E9E7E2]/50">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function QuickActionsCard() {
  const actions = [
    { id: 1, name: "Create Blog Post", href: "/admin/dashboard/blog/new", color: "bg-blue-500/10 text-blue-400" },
    { id: 2, name: "Add New Project", href: "/admin/dashboard/projects/new", color: "bg-green-500/10 text-green-400" },
    {
      id: 3,
      name: "Add Testimonial",
      href: "/admin/dashboard/testimonials/new",
      color: "bg-purple-500/10 text-purple-400",
    },
    { id: 4, name: "Update Profile", href: "/admin/dashboard/settings", color: "bg-yellow-500/10 text-yellow-400" },
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
