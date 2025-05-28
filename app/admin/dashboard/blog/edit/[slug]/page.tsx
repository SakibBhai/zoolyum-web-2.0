"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { fetchBlogPost, updateBlogPost } from "@/lib/blog-operations"
import { PageTransition } from "@/components/page-transition"
import { Save, X, Loader2 } from "lucide-react"
import { ImageUploader } from "@/components/admin/image-uploader"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { useToast } from "@/hooks/use-toast"

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    tags: "",
    status: "draft",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true)
        const post = await fetchBlogPost(params.slug)

        // Format tags if they're an array
        let formattedTags = post.tags
        if (Array.isArray(post.tags)) {
          formattedTags = post.tags.join(", ")
        }

        setFormData({
          ...post,
          tags: formattedTags,
        })
      } catch (err: any) {
        setError(err.message || "Failed to load blog post")
        toast({
          title: "Error",
          description: err.message || "Failed to load blog post",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [params.slug, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    })
  }

  const handleImageChange = (url: string | null) => {
    setFormData({
      ...formData,
      image_url: url || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("You must be logged in to update a post")
      }

      await updateBlogPost(formData.id, formData)
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })
      router.push("/admin/dashboard/blog")
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the post")
      toast({
        title: "Error",
        description: err.message || "An error occurred while updating the post",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/dashboard/blog")
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5001]" />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#333333] rounded-lg text-[#E9E7E2]/70 hover:bg-[#252525] transition-colors flex items-center"
              disabled={isSubmitting}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors flex items-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Post title"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="post-slug"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              placeholder="Brief description of the post"
              required
            />
          </div>

          <div className="mb-6">
            <ImageUploader
              label="Featured Image"
              initialImageUrl={formData.image_url}
              onImageChange={handleImageChange}
              helpText="Upload a featured image for your blog post (16:9 ratio recommended)"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <RichTextEditor
              initialValue={formData.content}
              onChange={handleContentChange}
              placeholder="Write your post content here..."
              minHeight="400px"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              placeholder="Brand Strategy, Marketing, Design"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-1/3 px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </form>
      </div>
    </PageTransition>
  )
}
