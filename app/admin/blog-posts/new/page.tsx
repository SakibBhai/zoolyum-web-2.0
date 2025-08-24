'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface BlogPostForm {
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  published: boolean
  tags: string[]
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

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
      slug: generateSlug(title)
    }))
    
    // Clear title error when user starts typing
    if (fieldErrors.title) {
      setFieldErrors(prev => ({ ...prev, title: '' }))
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagsInput(value)
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  // Enhanced validation function
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be less than 200 characters'
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
    
    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required'
    } else if (formData.excerpt.length < 10) {
      errors.excerpt = 'Excerpt must be at least 10 characters long'
    } else if (formData.excerpt.length > 500) {
      errors.excerpt = 'Excerpt must be less than 500 characters'
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required'
    } else if (formData.content.length < 50) {
      errors.content = 'Content must be at least 50 characters long'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    
    if (!isDraft && !validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below before submitting.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to create blog post')
      }

      const newPost = await response.json()
      
      toast({
        title: 'Success',
        description: `Blog post ${isDraft ? 'saved as draft' : 'created'} successfully!`
      })

      router.push('/admin/blog-posts')
    } catch (error) {
      console.error('Error creating blog post:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create blog post',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog-posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">Create New Blog Post</h1>
            <p className="text-[#E9E7E2]/60 mt-1">Write and publish a new blog post</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={!formData.title || !formData.content}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
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
            {isSubmitting ? 'Publishing...' : 'Publish'}
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
                  Enter the basic details for your blog post
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
                    className={`bg-[#252525] border-[#333] text-[#E9E7E2] ${
                      fieldErrors.title ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.title && (
                    <p className="text-red-500 text-sm">{fieldErrors.title}</p>
                  )}
                  <p className="text-[#E9E7E2]/60 text-sm">
                    {formData.title.length}/200 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[#E9E7E2]">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                      if (fieldErrors.slug) {
                        setFieldErrors(prev => ({ ...prev, slug: '' }))
                      }
                    }}
                    placeholder="blog-post-url-slug"
                    className={`bg-[#252525] border-[#333] text-[#E9E7E2] ${
                      fieldErrors.slug ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.slug && (
                    <p className="text-red-500 text-sm">{fieldErrors.slug}</p>
                  )}
                  <p className="text-sm text-[#E9E7E2]/60">
                    URL: /blog/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-[#E9E7E2]">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, excerpt: e.target.value }))
                      if (fieldErrors.excerpt) {
                        setFieldErrors(prev => ({ ...prev, excerpt: '' }))
                      }
                    }}
                    placeholder="Brief description of the blog post"
                    className={`bg-[#252525] border-[#333] text-[#E9E7E2] min-h-[100px] ${
                      fieldErrors.excerpt ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.excerpt && (
                    <p className="text-red-500 text-sm">{fieldErrors.excerpt}</p>
                  )}
                  <p className="text-sm text-[#E9E7E2]/60">
                    {formData.excerpt.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Content *</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Write your blog post content using Markdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <RichTextEditor
                  value={formData.content}
                  onChangeAction={(content) => {
                    setFormData(prev => ({ ...prev, content }))
                    if (fieldErrors.content) {
                      setFieldErrors(prev => ({ ...prev, content: '' }))
                    }
                  }}
                  placeholder="Write your blog post content here..."
                  minHeight="400px"
                  folder="blog"
                  className={fieldErrors.content ? 'border-red-500' : ''}
                />
                {fieldErrors.content && (
                  <p className="text-red-500 text-sm">{fieldErrors.content}</p>
                )}
                <p className="text-[#E9E7E2]/60 text-sm">
                  {formData.content.replace(/<[^>]*>/g, '').length} characters
                </p>
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
                  <Label htmlFor="published" className="text-[#E9E7E2]">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>
                <p className="text-sm text-[#E9E7E2]/60">
                  {formData.published ? 'Post will be published and visible to readers' : 'Post will be saved as draft'}
                </p>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  label="Featured Image"
                  initialImageUrl={formData.imageUrl}
                  onImageChangeAction={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
                  folder="blog"
                  helpText="Upload a featured image for your blog post. Recommended size: 1200x630px for optimal social media sharing."
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
                  <p className="text-sm text-[#E9E7E2]/60">
                    Separate multiple tags with commas. Tags help readers find your content.
                  </p>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#FF5001]/20 border border-[#FF5001]/30 text-[#FF5001] rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {formData.tags.length > 10 && (
                  <p className="text-yellow-500 text-sm">
                    Consider using fewer tags (10 or less) for better organization.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}