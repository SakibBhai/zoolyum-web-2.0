"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchProjects, deleteProject } from "@/lib/project-operations"
import { PageTransition } from "@/components/page-transition"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const data = await fetchProjects()
        setProjects(data)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project: any) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    try {
      await deleteProject(id)
      setProjects(projects.filter((project: any) => project.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/dashboard/projects/edit/${slug}`)
  }

  const handleView = (slug: string) => {
    window.open(`/work/${slug}`, "_blank")
  }

  return (
    <PageTransition>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Projects</h1>
          <Link
            href="/admin/dashboard/projects/new"
            className="inline-flex items-center px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </Link>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
          <div className="p-4 border-b border-[#333333]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E9E7E2]/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#252525]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-[#252525] rounded w-3/4 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-[#252525] rounded w-1/2 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-[#252525] rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-[#252525] rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-8 bg-[#252525] rounded w-24 ml-auto animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project: any) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{project.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#E9E7E2]/70">{project.category || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#E9E7E2]/70">{formatDate(project.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(project.slug)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="View project"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(project.slug)}
                            className="p-1 text-[#FF5001] hover:text-[#FF5001]/80"
                            title="Edit project"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className={`p-1 ${
                              deleteConfirm === project.id ? "text-red-500" : "text-red-400 hover:text-red-300"
                            }`}
                            title={deleteConfirm === project.id ? "Click again to confirm" : "Delete project"}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-[#E9E7E2]/50">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
