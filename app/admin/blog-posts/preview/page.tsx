'use client'

import { useState, useEffect } from 'react'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface BlogPostPreview {
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  published: boolean
  tags: string[]
}

export default function BlogPostPreviewPage() {
  const [previewData, setPreviewData] = useState<BlogPostPreview | null>(null)

  useEffect(() => {
    // Get preview data from sessionStorage
    const storedData = sessionStorage.getItem('blog-post-preview')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setPreviewData(data)
      } catch (error) {
        console.error('Error parsing preview data:', error)
      }
    }
  }, [])

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-[#E9E7E2]">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-[#E9E7E2]">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 text-[#E9E7E2]">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-[#E9E7E2]/80 leading-relaxed">')
      .replace(/\n/g, '<br />')
  }

  if (!previewData) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <Card className="bg-[#1A1A1A] border-[#333] p-8">
          <CardContent className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Preview Data</h1>
            <p className="text-[#E9E7E2]/60 mb-4">
              No blog post data found for preview. Please go back and try again.
            </p>
            <Link href="/admin/blog-posts/new">
              <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      {/* Header */}
      <div className="border-b border-[#333] bg-[#1A1A1A]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.close()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Blog Post Preview</h1>
                <p className="text-sm text-[#E9E7E2]/60">
                  This is how your blog post will appear to readers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                previewData.published 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {previewData.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {previewData.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={previewData.imageUrl}
                  alt={previewData.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center text-sm text-[#E9E7E2]/60">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {previewData.title}
              </h1>
              
              <p className="text-xl text-[#E9E7E2]/80 leading-relaxed">
                {previewData.excerpt}
              </p>
              
              {previewData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#FF5001]/20 text-[#FF5001] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="space-y-4 text-[#E9E7E2]/80 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-4 text-[#E9E7E2]/80 leading-relaxed">${renderMarkdown(previewData.content)}</p>`
              }}
            />
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#333]">
          <div className="text-center">
            <p className="text-[#E9E7E2]/60">
              This is a preview of your blog post. Close this window to continue editing.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}