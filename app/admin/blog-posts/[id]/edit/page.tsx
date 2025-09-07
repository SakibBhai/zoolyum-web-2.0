'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { ImageUploader } from '@/components/admin/image-uploader'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  published: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  authorId?: string
}

interface BlogPostForm {
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  published: boolean
  tags: string[]
}

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    published: false,
    tags: []
  })
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog-posts/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog post')
        }
        const post: BlogPost = await response.json()
        setOriginalPost(post)
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl || '',
          published: post.published,
          tags: post.tags
        })
        setTagsInput(post.tags.join(', '))
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast({
          title: 'Error',
          description: 'Failed to load blog post',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBlogPost()
    }
  }, [params.id, toast])

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it hasn't been manually changed
      slug: originalPost && prev.slug === originalPost.slug ? generateSlug(title) : prev.slug
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagsInput(value)
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.slug.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (title, slug, excerpt, and content).',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/blog-posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          published: isDraft ? false : formData.published
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update blog post')
      }

      const updatedPost = await response.json()
      
      toast({
        title: 'Success',
        description: `Blog post ${isDraft ? 'saved as draft' : 'updated'} successfully!`
      })

      router.push('/admin/blog-posts')
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update blog post',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    // Store form data in sessionStorage for preview
    sessionStorage.setItem('blog-post-preview', JSON.stringify(formData))
    window.open('/admin/blog-posts/preview', '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-[#252525] rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-[#252525] rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-[#252525] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-64 bg-[#252525] rounded animate-pulse"></div>
            <div className="w-full h-96 bg-[#252525] rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-32 bg-[#252525] rounded animate-pulse"></div>
            <div className="w-full h-24 bg-[#252525] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!originalPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog-posts">
            <Button className="hover:bg-[#252525]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">Blog Post Not Found</h1>
            <p className="text-[#E9E7E2]/60 mt-1">The requested blog post could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog-posts">
            <Button className="hover:bg-[#252525]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">Edit Blog Post</h1>
            <p className="text-[#E9E7E2]/60 mt-1">Update your blog post content</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            className="border border-[#333] hover:bg-[#252525]"
            onClick={handlePreview}
            disabled={!formData.title || !formData.content}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            className="border border-[#333] hover:bg-[#252525]"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            form="blog-post-form"
            className="bg-[#FF5001] hover:bg-[#FF5001]/90"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </div>

      <form id="blog-post-form" onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Basic Information</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Update the basic details for your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#E9E7E2]">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter blog post title"
                    className="bg-[#252525] border-[#333] text-[#E9E7E2]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[#E9E7E2]">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="blog-post-url-slug"
                    className="bg-[#252525] border-[#333] text-[#E9E7E2]"
                    required
                  />
                  <p className="text-sm text-[#E9E7E2]/60">
                    URL: /blog/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-[#E9E7E2]">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the blog post"
                    className="bg-[#252525] border-[#333] text-[#E9E7E2] min-h-[100px]"
                    required
                  />
                  <p className="text-sm text-[#E9E7E2]/60">
                    {formData.excerpt.length}/300 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Content *</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Update your blog post content using Markdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={formData.content}
                  onChangeAction={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Write your blog post content here..."
                  minHeight="400px"
                  folder="blog"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-[#E9E7E2]">Published</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>
                <p className="text-sm text-[#E9E7E2]/60">
                  {formData.published ? 'Post is published and visible to readers' : 'Post is saved as draft'}
                </p>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Featured Image</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Upload or add a cover photo for your blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  label="Cover Photo"
                  initialImageUrl={formData.imageUrl}
                  onImageChangeAction={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
                  helpText="Upload a cover image for your blog post (16:9 ratio recommended)"
                  folder="blog"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-[#E9E7E2]">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="web design, branding, strategy"
                    className="bg-[#252525] border-[#333] text-[#E9E7E2]"
                  />
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#FF5001]/20 text-[#FF5001] rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}