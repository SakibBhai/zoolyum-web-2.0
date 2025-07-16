"use client"

import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { useState, useEffect } from "react"

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

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog-posts?published=true');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const posts = await response.json();
        setBlogPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Insights"
              title="Strategic Brand Insights & Perspectives"
              description="Explore our collection of thought leadership on brand development, digital transformation, and market positioning strategies."
              titleGradient={true}
            />

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-[#1A1A1A] rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full aspect-[3/2] bg-[#252525]"></div>
                    <div className="p-6">
                      <div className="h-4 bg-[#252525] rounded mb-2"></div>
                      <div className="h-6 bg-[#252525] rounded mb-2"></div>
                      <div className="h-4 bg-[#252525] rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-[#252525] rounded-full"></div>
                        <div className="h-6 w-20 bg-[#252525] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Error loading blog posts: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-[#FF5001] text-[#161616] rounded-lg hover:bg-[#FF5001]/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#E9E7E2]/60 text-lg">No blog posts published yet.</p>
              </div>
            ) : (
              <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                <div key={index} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#252525] transition-colors group">
                      {post.imageUrl && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-[#E9E7E2]/60 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-[#FF5001] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[#E9E7E2]/80 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-[#FF5001] font-medium">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              </StaggerReveal>
            )}

            <ScrollReveal className="mt-16 flex justify-center" delay={0.4}>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
              >
                Subscribe to Newsletter
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}
