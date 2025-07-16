"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import Image from "next/image"
import { Calendar, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog-posts/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found')
          }
          throw new Error('Failed to fetch blog post')
        }
        const postData = await response.json()
        
        // Only show published posts to public
        if (!postData.published) {
          throw new Error('Blog post not found')
        }
        
        setPost(postData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
          <Header />
          <main className="pt-24">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-[#252525] rounded mb-4"></div>
                  <div className="h-4 bg-[#252525] rounded mb-8 w-1/3"></div>
                  <div className="w-full aspect-[16/9] bg-[#252525] rounded-xl mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-[#252525] rounded"></div>
                    <div className="h-4 bg-[#252525] rounded"></div>
                    <div className="h-4 bg-[#252525] rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    )
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
          <Header />
          <main className="pt-24">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                <p className="text-[#E9E7E2]/60 mb-8">
                  {error || 'The blog post you are looking for does not exist.'}
                </p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />
        
        <main className="pt-24">
          <article className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Back to Blog */}
              <ScrollReveal>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors mb-8"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </ScrollReveal>

              {/* Article Header */}
              <ScrollReveal delay={0.1}>
                <header className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[#E9E7E2]/60 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 bg-[#252525] text-[#E9E7E2]/80 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {post.excerpt && (
                    <p className="text-xl text-[#E9E7E2]/80 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </header>
              </ScrollReveal>

              {/* Featured Image */}
              {post.imageUrl && (
                <ScrollReveal delay={0.2}>
                  <div className="mb-12">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="w-full aspect-[16/9] object-cover rounded-xl"
                      priority
                    />
                  </div>
                </ScrollReveal>
              )}

              {/* Article Content */}
              <ScrollReveal delay={0.3}>
                <div 
                  className="prose prose-lg prose-invert max-w-none"
                  style={{
                    '--tw-prose-body': '#E9E7E2',
                    '--tw-prose-headings': '#E9E7E2',
                    '--tw-prose-links': '#FF5001',
                    '--tw-prose-bold': '#E9E7E2',
                    '--tw-prose-counters': '#E9E7E2',
                    '--tw-prose-bullets': '#E9E7E2',
                    '--tw-prose-hr': '#333333',
                    '--tw-prose-quotes': '#E9E7E2',
                    '--tw-prose-quote-borders': '#FF5001',
                    '--tw-prose-captions': '#E9E7E2',
                    '--tw-prose-code': '#E9E7E2',
                    '--tw-prose-pre-code': '#E9E7E2',
                    '--tw-prose-pre-bg': '#1A1A1A',
                    '--tw-prose-th-borders': '#333333',
                    '--tw-prose-td-borders': '#333333',
                  } as React.CSSProperties}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </ScrollReveal>

              {/* Article Footer */}
              <ScrollReveal delay={0.4}>
                <footer className="mt-16 pt-8 border-t border-[#333333]">
                  <div className="flex justify-center">
                    <Link 
                      href="/blog" 
                      className="inline-flex items-center px-6 py-3 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Blog
                    </Link>
                  </div>
                </footer>
              </ScrollReveal>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}