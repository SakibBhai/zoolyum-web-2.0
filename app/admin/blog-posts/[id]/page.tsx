'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Edit, Trash, Calendar, User, Tag, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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

export default function BlogPostViewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog-posts/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog post')
        }
        const post = await response.json()
        setBlogPost(post)
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

  const handleDelete = async () => {
    if (!blogPost) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/blog-posts/${blogPost.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete blog post')
      }

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully'
      })

      router.push('/admin/blog-posts')
    } catch (error) {
      console.error('Error deleting blog post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive'
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <div className="lg:col-span-2">
            <div className="w-full h-64 bg-[#252525] rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-32 bg-[#252525] rounded animate-pulse"></div>
            <div className="w-full h-24 bg-[#252525] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog-posts">
            <Button variant="ghost" size="icon">
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
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">{blogPost.title}</h1>
            <p className="text-[#E9E7E2]/60 mt-1">View blog post details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/blog/${blogPost.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </Button>
          </Link>
          <Link href={`/admin/blog-posts/${blogPost.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1A1A1A] border-[#333]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#E9E7E2]">Delete Blog Post</AlertDialogTitle>
                <AlertDialogDescription className="text-[#E9E7E2]/60">
                  Are you sure you want to delete "{blogPost.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#252525] border-[#333] text-[#E9E7E2] hover:bg-[#333]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {blogPost.imageUrl && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardContent className="p-0">
                <div className="aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={blogPost.imageUrl}
                    alt={blogPost.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Excerpt */}
          <Card className="bg-[#1A1A1A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#E9E7E2]/80 leading-relaxed">{blogPost.excerpt}</p>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="bg-[#1A1A1A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={blogPost.content} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-[#1A1A1A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={blogPost.published ? 'default' : 'secondary'}
                className={blogPost.published ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}
              >
                {blogPost.published ? 'Published' : 'Draft'}
              </Badge>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-[#1A1A1A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 mt-1 text-[#E9E7E2]/60" />
                <div>
                  <p className="text-sm font-medium text-[#E9E7E2]">Created</p>
                  <p className="text-sm text-[#E9E7E2]/60">{formatDate(blogPost.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 mt-1 text-[#E9E7E2]/60" />
                <div>
                  <p className="text-sm font-medium text-[#E9E7E2]">Updated</p>
                  <p className="text-sm text-[#E9E7E2]/60">{formatDate(blogPost.updatedAt)}</p>
                </div>
              </div>

              {blogPost.authorId && (
                <div className="flex items-start space-x-3">
                  <User className="w-4 h-4 mt-1 text-[#E9E7E2]/60" />
                  <div>
                    <p className="text-sm font-medium text-[#E9E7E2]">Author</p>
                    <p className="text-sm text-[#E9E7E2]/60">{blogPost.authorId}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <ExternalLink className="w-4 h-4 mt-1 text-[#E9E7E2]/60" />
                <div>
                  <p className="text-sm font-medium text-[#E9E7E2]">Slug</p>
                  <p className="text-sm text-[#E9E7E2]/60 font-mono">{blogPost.slug}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {blogPost.tags.length > 0 && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2] flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-[#FF5001]/30 text-[#FF5001]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}