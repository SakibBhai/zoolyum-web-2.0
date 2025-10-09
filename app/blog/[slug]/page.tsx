"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import Image from "next/image"
import { Calendar, ArrowLeft, Tag, Clock, User } from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

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
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-5xl mx-auto">
                <div className="animate-pulse">
                  {/* Back button skeleton */}
                  <div className="h-6 bg-[#252525] rounded mb-8 w-32"></div>
                  
                  {/* Title skeleton */}
                  <div className="h-12 bg-[#252525] rounded mb-6"></div>
                  <div className="h-8 bg-[#252525] rounded mb-4 w-3/4"></div>
                  
                  {/* Meta info skeleton */}
                  <div className="flex gap-6 mb-6">
                    <div className="h-5 bg-[#252525] rounded w-32"></div>
                    <div className="h-5 bg-[#252525] rounded w-24"></div>
                  </div>
                  
                  {/* Tags skeleton */}
                  <div className="flex gap-2 mb-8">
                    <div className="h-6 bg-[#252525] rounded-full w-16"></div>
                    <div className="h-6 bg-[#252525] rounded-full w-20"></div>
                    <div className="h-6 bg-[#252525] rounded-full w-18"></div>
                  </div>
                  
                  {/* Excerpt skeleton */}
                  <div className="h-6 bg-[#252525] rounded mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded mb-12 w-5/6"></div>
                  
                  {/* Image skeleton */}
                  <div className="w-full aspect-[16/9] bg-[#252525] rounded-xl mb-12"></div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-4">
                    <div className="h-4 bg-[#252525] rounded"></div>
                    <div className="h-4 bg-[#252525] rounded"></div>
                    <div className="h-4 bg-[#252525] rounded w-4/5"></div>
                    <div className="h-4 bg-[#252525] rounded w-3/4"></div>
                    <div className="h-4 bg-[#252525] rounded"></div>
                    <div className="h-4 bg-[#252525] rounded w-5/6"></div>
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
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center py-20">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#252525] flex items-center justify-center">
                      <ArrowLeft className="w-8 h-8 text-[#FF5001]" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 text-[#E9E7E2]">Blog Post Not Found</h1>
                    <p className="text-xl text-[#E9E7E2]/60 mb-8 max-w-2xl mx-auto leading-relaxed">
                      {error || 'The blog post you are looking for does not exist or may have been moved.'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/blog" 
                      className="inline-flex items-center justify-center px-8 py-4 bg-[#FF5001] text-[#161616] font-semibold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Blog
                    </Link>
                    <Link 
                      href="/" 
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#333333] text-[#E9E7E2] font-semibold rounded-lg hover:border-[#FF5001] hover:text-[#FF5001] transition-all duration-300"
                    >
                      Go Home
                    </Link>
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

  const estimatedReadTime = Math.ceil((post.content || '').split(' ').length / 200); // Assuming 200 words per minute

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />
        
        <main className="pt-24">
          <article className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
              {/* Back to Blog */}
              <ScrollReveal>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-[#E9E7E2]/60 hover:text-[#FF5001] transition-all duration-300 mb-12 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Back to Blog</span>
                </Link>
              </ScrollReveal>

              {/* Article Header */}
              <ScrollReveal delay={0.1}>
                <header className="mb-16">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-[#E9E7E2] to-[#E9E7E2]/80 bg-clip-text text-transparent">
                    {post.title}
                  </h1>
                  
                  {/* Enhanced Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-[#E9E7E2]/60 mb-8 pb-6 border-b border-[#333333]/50">
                    <div className="flex items-center bg-[#252525]/50 px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF5001]" />
                      <span className="font-medium">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center bg-[#252525]/50 px-4 py-2 rounded-full">
                      <Clock className="w-4 h-4 mr-2 text-[#FF5001]" />
                      <span className="font-medium">{estimatedReadTime} min read</span>
                    </div>
                    <div className="flex items-center bg-[#252525]/50 px-4 py-2 rounded-full">
                      <User className="w-4 h-4 mr-2 text-[#FF5001]" />
                      <span className="font-medium">Zoolyum Team</span>
                    </div>
                  </div>

                  {/* Tags with improved styling */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FF5001]/10 to-[#FF5001]/5 border border-[#FF5001]/20 text-[#FF5001] rounded-full text-sm font-medium hover:bg-[#FF5001]/20 transition-all duration-300 cursor-pointer"
                        >
                          <Tag className="w-3 h-3 mr-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Enhanced excerpt */}
                  {post.excerpt && (
                    <div className="bg-gradient-to-r from-[#252525]/50 to-[#252525]/20 border-l-4 border-[#FF5001] p-6 rounded-r-lg">
                      <p className="text-xl md:text-2xl text-[#E9E7E2]/90 leading-relaxed font-light italic">
                        {post.excerpt}
                      </p>
                    </div>
                  )}
                </header>
              </ScrollReveal>

              {/* Featured Image with enhanced styling */}
              {post.imageUrl && (
                <ScrollReveal delay={0.2}>
                  <div className="mb-16 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/20 to-transparent rounded-xl z-10"></div>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="w-full aspect-[16/9] object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </ScrollReveal>
              )}

              {/* Article Content with better spacing */}
              <ScrollReveal delay={0.3}>
                <div className="prose-container">
                  <MarkdownRenderer 
                    content={post.content}
                    className="prose-invert prose-lg md:prose-xl max-w-none"
                  />
                </div>
              </ScrollReveal>

              {/* Enhanced Article Footer */}
              <ScrollReveal delay={0.4}>
                <footer className="mt-20 pt-12 border-t border-[#333333]">
                  <div className="bg-gradient-to-r from-[#252525]/30 to-[#252525]/10 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-[#E9E7E2]">Enjoyed this article?</h3>
                    <p className="text-[#E9E7E2]/60 mb-8 max-w-2xl mx-auto">
                      Discover more insights and stories from our team. Explore our latest blog posts and stay updated with industry trends.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/blog" 
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#FF5001] text-[#161616] font-semibold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 hover:scale-105 group"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        More Articles
                      </Link>
                      <Link 
                        href="/contact" 
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#333333] text-[#E9E7E2] font-semibold rounded-lg hover:border-[#FF5001] hover:text-[#FF5001] transition-all duration-300"
                      >
                        Get in Touch
                      </Link>
                    </div>
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