"use client";

import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Project, fetchProjectBySlug, fetchProjects, ProcessStep, GalleryImage, Result, Testimonial } from "@/lib/project-operations";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className="text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();

  const router = useRouter();
  const slug = params.slug;
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the current project by slug
        const currentProject = await fetchProjectBySlug(slug);
        
        if (!currentProject) {
          router.push("/work");
          return;
        }
        
        setProject(currentProject);
        
        // Fetch all projects for navigation
        const allProjects = await fetchProjects({ published: true });
        const currentProjectIndex = allProjects.findIndex((p) => p.id === currentProject.id);
        
        if (currentProjectIndex !== -1) {
          // Set next and previous projects for navigation
          const nextIndex = (currentProjectIndex + 1) % allProjects.length;
          const prevIndex = (currentProjectIndex - 1 + allProjects.length) % allProjects.length;
          
          setNextProject(allProjects[nextIndex]);
          setPrevProject(allProjects[prevIndex]);
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-[#E9E7E2]/70 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Link href="/work" className="bg-[#FF5001] text-white px-6 py-3 rounded-lg hover:bg-[#FF5001]/90 transition-colors">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <Suspense
            fallback={
              <div className="h-[50vh] md:h-[70vh] w-full relative flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            {/* Hero Section */}
            <section className="relative">
              <div className="h-[50vh] md:h-[70vh] w-full relative overflow-hidden">
                <Image
                  src={
                    project.heroImageUrl ||
                    "/placeholder.svg?height=800&width=1600"
                  }
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-70"></div>
                <div className="absolute inset-0 flex items-end">
                  <div className="container mx-auto px-4 pb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
                        {project.category}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4 max-w-4xl">
                        {project.title}
                      </h1>
                      <div className="flex flex-wrap gap-4 items-center text-[#E9E7E2]/80">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{project.year}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{project.client}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{project.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>
          </Suspense>

          {/* Project Overview */}
          <Suspense
            fallback={
              <div className="py-16 md:py-24 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-6">
                      Project Overview
                    </h2>
                    <div className="prose prose-lg prose-invert max-w-none">
                      <p>{project.overview}</p>
                    </div>
                  </div>
                  <div className="bg-[#1A1A1A] p-6 rounded-xl h-fit">
                    <h3 className="text-xl font-bold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[#FF5001] text-sm font-medium">
                          Client
                        </h4>
                        <p>{project.client}</p>
                      </div>
                      <div>
                        <h4 className="text-[#FF5001] text-sm font-medium">
                          Timeline
                        </h4>
                        <p>{project.duration}</p>
                      </div>
                      <div>
                        <h4 className="text-[#FF5001] text-sm font-medium">
                          Services
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.services?.map(
                            (service: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#252525] rounded-full text-xs"
                              >
                                {service}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Suspense>

          {/* Challenge & Solution */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p>{project.challenge}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">The Solution</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p>{project.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Our Approach
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {project.process?.map((step: ProcessStep, index: number) => (
                  <ProcessCard key={index} step={step} index={index} />
                )) || []}
              </div>
            </div>
          </section>

          {/* Project Gallery */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery?.map((image: GalleryImage, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="overflow-hidden rounded-xl"
                  >
                    <Image
                      src={image.url || "/placeholder.svg?height=600&width=800"}
                      alt={image.caption || "Project image"}
                      width={800}
                      height={600}
                      className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                )) || []}
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Results & Impact
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {project.results?.map((result: Result, index: number) => (
                  <ResultCard key={index} result={result} index={index} />
                )) || []}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          {project.testimonial && (
            <section className="py-16 md:py-24 bg-[#1A1A1A]">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
                    Testimonial
                  </span>
                  <h2 className="text-3xl font-bold mt-2">Client Feedback</h2>
                </div>
                <div className="bg-[#212121] p-8 md:p-12 rounded-2xl border border-[#333333]">
                  <div className="text-[#FF5001] mb-6">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 11L8 17H5L7 11H5V5H11V11H10ZM18 11L16 17H13L15 11H13V5H19V11H18Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="text-xl md:text-2xl mb-8">
                    {project.testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#333333] mr-4"></div>
                    <div>
                      <h4 className="font-bold">
                        {project.testimonial.author}
                      </h4>
                      <p className="text-sm text-[#E9E7E2]/70">
                        {project.testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Project Navigation */}
          <Suspense
            fallback={
              <div className="py-16 md:py-24 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            {project && (
              <ProjectNavigation
                prevProject={prevProject}
                nextProject={nextProject}
              />
            )}
          </Suspense>

          {/* CTA */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Brand?
              </h2>
              <p className="text-lg text-[#E9E7E2]/80 max-w-2xl mx-auto mb-8">
                Let's collaborate to create a strategic brand experience that
                resonates with your audience and drives results.
              </p>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
              >
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}

// Interfaces are now imported from project-operations.ts



interface ProcessCardProps {
  step: ProcessStep;
  index: number;
}

interface ResultCardProps {
  result: Result;
  index: number;
}

function ProcessCard({ step, index }: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333333]"
    >
      <div className="w-12 h-12 bg-[#FF5001]/10 rounded-xl flex items-center justify-center mb-6">
        <span className="text-[#FF5001] font-bold text-xl">{index + 1}</span>
      </div>
      <h3 className="text-xl font-bold mb-4">{step.title}</h3>
      <p className="text-[#E9E7E2]/70">{step.description}</p>
    </motion.div>
  );
}

function ResultCard({ result, index }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333333] text-center"
    >
      <div className="text-[#FF5001] text-4xl font-bold mb-2">
        {result.value}
      </div>
      <h3 className="text-xl font-bold mb-4">{result.metric}</h3>
    </motion.div>
  );
}

// Create a ProjectNavigationError component for error handling
function ProjectNavigationError() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center text-[#E9E7E2]/60">
          Unable to load project navigation. Please try refreshing the page.
        </div>
      </div>
    </div>
  );
}

// Create a ProjectNavigation component for better organization
function ProjectNavigation({
  prevProject,
  nextProject,
}: {
  prevProject: Project | null;
  nextProject: Project | null;
}) {
  if (!prevProject && !nextProject) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8">
          {prevProject && (
            <Link href={`/work/${prevProject.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <Image
                  src={
                    prevProject.imageUrl || "/placeholder.svg?height=400&width=600"
                  }
                  alt={prevProject.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#161616]/50 group-hover:bg-[#161616]/30 transition-colors duration-300"></div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-[#E9E7E2]/60">
                  Previous Project
                </div>
                <h3 className="text-xl font-bold">{prevProject.title}</h3>
              </div>
            </Link>
          )}

          {nextProject && (
            <Link href={`/work/${nextProject.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <Image
                  src={
                    nextProject.imageUrl || "/placeholder.svg?height=400&width=600"
                  }
                  alt={nextProject.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#161616]/50 group-hover:bg-[#161616]/30 transition-colors duration-300"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="text-sm text-[#E9E7E2]/60">Next Project</div>
                <h3 className="text-xl font-bold">{nextProject.title}</h3>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
