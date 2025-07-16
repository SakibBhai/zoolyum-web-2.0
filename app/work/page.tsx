"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { useEffect, useState } from "react"
import { fetchProjects, Project } from "@/lib/project-operations"

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const data = await fetchProjects({ published: true })
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Portfolio"
              title="Strategic Brand Transformations"
              description="Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence."
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#E9E7E2]/60 text-lg">No projects found.</p>
              </div>
            ) : (
              <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <Link href={`/work/${project.slug}`} className="block">
                      <Card className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden transform-gpu transition-all duration-300 hover:scale-105">
                        <div className="overflow-hidden">
                          <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                            <Image
                              src={project.imageUrl || "/placeholder.svg"}
                              alt={project.title}
                              width={600}
                              height={400}
                              className="w-full aspect-[3/2] object-cover"
                            />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <span className="text-[#FF5001] text-sm">{project.category}</span>
                          <h3 className="text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors">{project.title}</h3>
                          <p className="text-[#E9E7E2]/70 mt-2">{project.description}</p>
                          <div className="mt-4 pt-4 border-t border-[#333333]">
                            <span className="text-[#FF5001] font-medium inline-flex items-center group/link">
                              View Project
                              <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </StaggerReveal>
            )}

            <ScrollReveal className="mt-16 flex justify-center" delay={0.4}>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
              >
                Start Your Project
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
