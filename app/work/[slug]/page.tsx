"use client"

import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const NavLink = ({ href, children }) => {
  return (
    <Link href={href} className="text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors duration-300">
      {children}
    </Link>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [project, setProject] = useState<any>(null)
  const [nextProject, setNextProject] = useState<any>(null)
  const [prevProject, setPrevProject] = useState<any>(null)

  useEffect(() => {
    // Find the current project based on the slug
    const currentProjectIndex = projects.findIndex((p) => p.slug === slug)

    if (currentProjectIndex === -1) {
      // Project not found, redirect to work page
      router.push("/work")
      return
    }

    setProject(projects[currentProjectIndex])

    // Set next and previous projects for navigation
    const nextIndex = (currentProjectIndex + 1) % projects.length
    const prevIndex = (currentProjectIndex - 1 + projects.length) % projects.length

    setNextProject(projects[nextIndex])
    setPrevProject(projects[prevIndex])
  }, [slug, router])

  if (!project) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="relative">
            <div className="h-[50vh] md:h-[70vh] w-full relative overflow-hidden">
              <Image
                src={project.heroImage || "/placeholder.svg?height=800&width=1600"}
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
                    <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4 max-w-4xl">{project.title}</h1>
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

          {/* Project Overview */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p>{project.overview}</p>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-xl h-fit">
                  <h3 className="text-xl font-bold mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#FF5001] text-sm font-medium">Client</h4>
                      <p>{project.client}</p>
                    </div>
                    <div>
                      <h4 className="text-[#FF5001] text-sm font-medium">Timeline</h4>
                      <p>{project.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-[#FF5001] text-sm font-medium">Services</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.services.map((service, index) => (
                          <span key={index} className="px-3 py-1 bg-[#252525] rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
              <h2 className="text-3xl font-bold mb-12 text-center">Our Approach</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {project.process.map((step, index) => (
                  <ProcessCard key={index} step={step} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Project Gallery */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="overflow-hidden rounded-xl"
                  >
                    <Image
                      src={image.src || "/placeholder.svg?height=600&width=800"}
                      alt={image.alt || "Project image"}
                      width={800}
                      height={600}
                      className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">Results & Impact</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {project.results.map((result, index) => (
                  <ResultCard key={index} result={result} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          {project.testimonial && (
            <section className="py-16 md:py-24 bg-[#1A1A1A]">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Testimonial</span>
                  <h2 className="text-3xl font-bold mt-2">Client Feedback</h2>
                </div>
                <div className="bg-[#212121] p-8 md:p-12 rounded-2xl border border-[#333333]">
                  <div className="text-[#FF5001] mb-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 11L8 17H5L7 11H5V5H11V11H10ZM18 11L16 17H13L15 11H13V5H19V11H18Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="text-xl md:text-2xl mb-8">{project.testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#333333] mr-4"></div>
                    <div>
                      <h4 className="font-bold">{project.testimonial.author}</h4>
                      <p className="text-sm text-[#E9E7E2]/70">{project.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Next/Prev Projects */}
          <section className="py-16 md:py-24 border-t border-[#333333]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">Explore More Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Link href={`/work/${prevProject.slug}`} className="group">
                  <div className="bg-[#1A1A1A] rounded-xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={prevProject.image || "/placeholder.svg?height=400&width=600"}
                        alt={prevProject.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-70"></div>
                      <div className="absolute inset-0 flex items-end p-6">
                        <div>
                          <div className="flex items-center text-[#FF5001] mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-sm">Previous Project</span>
                          </div>
                          <h3 className="text-xl font-bold">{prevProject.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href={`/work/${nextProject.slug}`} className="group">
                  <div className="bg-[#1A1A1A] rounded-xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={nextProject.image || "/placeholder.svg?height=400&width=600"}
                        alt={nextProject.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-70"></div>
                      <div className="absolute inset-0 flex items-end justify-end p-6">
                        <div className="text-right">
                          <div className="flex items-center justify-end text-[#FF5001] mb-2">
                            <span className="text-sm">Next Project</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                          <h3 className="text-xl font-bold">{nextProject.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Brand?</h2>
              <p className="text-lg text-[#E9E7E2]/80 max-w-2xl mx-auto mb-8">
                Let's collaborate to create a strategic brand experience that resonates with your audience and drives
                results.
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
  )
}

function ProcessCard({ step, index }) {
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
  )
}

function ResultCard({ result, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333333] text-center"
    >
      <div className="text-[#FF5001] text-4xl font-bold mb-2">{result.stat}</div>
      <h3 className="text-xl font-bold mb-4">{result.title}</h3>
      <p className="text-[#E9E7E2]/70">{result.description}</p>
    </motion.div>
  )
}

// Expanded project data with detailed case study information
const projects = [
  {
    title: "Nexus Rebrand",
    slug: "nexus-rebrand",
    category: "Brand Strategy",
    description: "Complete brand transformation for a tech company entering new markets.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2023",
    client: "Nexus Technologies",
    duration: "3 months",
    services: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Marketing Collateral"],
    overview:
      "Nexus Technologies was at a pivotal moment in their growth journey. As they prepared to expand into new international markets and launch innovative product lines, their existing brand no longer reflected their vision and ambitions. We partnered with Nexus to completely reimagine their brand identity, creating a cohesive system that would position them as industry leaders and support their expansion goals.",
    challenge:
      "Nexus had built a strong reputation in their home market, but their brand lacked the sophistication and clarity needed to compete on a global scale. Their visual identity was inconsistent across touchpoints, and their messaging failed to communicate their unique value proposition effectively. Additionally, internal teams lacked clear guidelines for brand implementation, resulting in fragmented customer experiences.",
    solution:
      "We developed a comprehensive brand strategy that clarified Nexus's positioning, values, and voice. This foundation informed the creation of a bold new visual identity system, including a dynamic logo that symbolized connectivity and innovation. We created detailed brand guidelines and templates for all key touchpoints, ensuring consistency across digital and physical environments. The rebrand was launched with an integrated campaign that introduced the new Nexus to existing customers and target markets.",
    process: [
      {
        title: "Discovery & Research",
        description:
          "Conducted stakeholder interviews, market analysis, competitor research, and customer surveys to understand perceptions and opportunities.",
      },
      {
        title: "Strategy Development",
        description:
          "Defined brand positioning, value proposition, personality, and messaging framework to guide all creative decisions.",
      },
      {
        title: "Identity Creation",
        description:
          "Designed a comprehensive visual system including logo, color palette, typography, imagery style, and graphic elements.",
      },
      {
        title: "Implementation",
        description:
          "Developed brand guidelines, templates, and assets for digital platforms, marketing materials, and product packaging.",
      },
      {
        title: "Launch & Activation",
        description:
          "Created launch strategy and campaign materials to introduce the new brand internally and externally.",
      },
      {
        title: "Measurement & Refinement",
        description:
          "Established metrics to track brand performance and made adjustments based on initial market response.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Nexus logo design process" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Brand guidelines" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Digital application" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Marketing materials" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Office environment" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Product packaging" },
    ],
    results: [
      {
        stat: "42%",
        title: "Increase in Brand Recognition",
        description:
          "Post-launch surveys showed significant improvement in brand recall and recognition in target markets.",
      },
      {
        stat: "3.5x",
        title: "Growth in International Inquiries",
        description: "The new brand positioning attracted substantially more interest from international prospects.",
      },
      {
        stat: "87%",
        title: "Employee Brand Alignment",
        description: "Internal surveys revealed strong understanding and embodiment of the new brand values.",
      },
    ],
    testimonial: {
      quote:
        "The rebrand has been transformative for our business. Not only do we have a visual identity that truly represents our vision, but the strategic foundation has aligned our entire organization and clarified our market position. Since launching, we've seen tangible business results and received overwhelmingly positive feedback from clients and partners.",
      author: "Sarah Johnson",
      position: "CEO, Nexus Technologies",
    },
  },
  {
    title: "Elevate Digital Transformation",
    slug: "elevate-digital",
    category: "Digital Strategy",
    description: "Digital ecosystem development for a growing lifestyle brand.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2022",
    client: "Elevate Lifestyle",
    duration: "6 months",
    services: ["Digital Strategy", "UX/UI Design", "Content Strategy", "E-commerce Optimization"],
    overview:
      "Elevate, a premium lifestyle brand with a strong physical retail presence, needed to accelerate their digital transformation to meet changing consumer behaviors and expand their market reach. We partnered with them to develop a comprehensive digital strategy and reimagine their online presence, creating a cohesive ecosystem that would drive e-commerce growth while maintaining their premium brand experience.",
    challenge:
      "Elevate's digital presence was fragmented and underperforming. Their website offered a poor user experience with low conversion rates, and their digital marketing efforts lacked strategic direction. The brand experience online failed to capture the premium feel of their physical stores, and they struggled to effectively engage with their audience across digital touchpoints. Additionally, they lacked the internal capabilities and processes to manage a sophisticated digital ecosystem.",
    solution:
      "We developed a holistic digital transformation strategy that addressed both customer-facing experiences and internal capabilities. This included a complete redesign of their e-commerce platform with an emphasis on storytelling and seamless shopping, a content strategy to engage their audience across channels, and a roadmap for building internal digital capabilities. The transformation was implemented in phases to ensure sustainable change and measurable results at each stage.",
    process: [
      {
        title: "Digital Audit",
        description: "Comprehensive assessment of existing digital touchpoints, performance metrics, and capabilities.",
      },
      {
        title: "Customer Journey Mapping",
        description: "Detailed mapping of current and ideal customer journeys across online and offline touchpoints.",
      },
      {
        title: "Digital Strategy Development",
        description:
          "Creation of a roadmap covering platform architecture, content, marketing, and organizational capabilities.",
      },
      {
        title: "Experience Design",
        description:
          "Redesign of the e-commerce platform with a focus on brand storytelling and conversion optimization.",
      },
      {
        title: "Content Strategy",
        description: "Development of a content framework to engage audiences across the customer journey.",
      },
      {
        title: "Implementation & Training",
        description: "Phased implementation of the new digital ecosystem and capability building for internal teams.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Website redesign" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Mobile experience" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Content strategy framework" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Email marketing templates" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Social media content" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Analytics dashboard" },
    ],
    results: [
      {
        stat: "156%",
        title: "Increase in E-commerce Revenue",
        description: "Year-over-year growth following the implementation of the new digital ecosystem.",
      },
      {
        stat: "4.2x",
        title: "Improvement in Conversion Rate",
        description: "Significant increase in website conversion rate through improved UX and content strategy.",
      },
      {
        stat: "68%",
        title: "Growth in Email Engagement",
        description: "Higher open and click-through rates with the new content strategy and design approach.",
      },
    ],
    testimonial: {
      quote:
        "Working with Zoolyum transformed not just our digital presence but our entire approach to customer engagement. The strategic vision and execution excellence delivered results far beyond our expectations. Our team now has both the tools and the capabilities to continue evolving our digital ecosystem as our business grows.",
      author: "Michael Chen",
      position: "Marketing Director, Elevate",
    },
  },
  {
    title: "Horizon Market Entry",
    slug: "horizon-market",
    category: "Consultancy",
    description: "Strategic positioning for a startup entering a competitive market.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2023",
    client: "Horizon",
    duration: "4 months",
    services: ["Market Analysis", "Brand Positioning", "Go-to-Market Strategy", "Pitch Development"],
    overview:
      "Horizon, an innovative fintech startup with a unique solution for sustainable investing, needed to establish a distinctive position in a crowded market dominated by established players. We provided strategic consultancy to help them define their market entry strategy, develop a compelling brand narrative, and create a roadmap for growth that would attract both customers and investors.",
    challenge:
      "As a newcomer in the competitive fintech space, Horizon faced significant challenges in gaining visibility and credibility. Their innovative approach to sustainable investing offered genuine value, but they struggled to articulate their unique selling proposition in a way that resonated with target audiences. Additionally, they needed to identify the most effective channels and partnerships to gain initial traction with limited resources.",
    solution:
      "We developed a comprehensive market entry strategy that positioned Horizon at the intersection of financial technology and sustainable impact. This included a distinctive brand narrative that highlighted their unique approach, a targeted go-to-market plan focusing on high-potential customer segments, and a compelling investor pitch that articulated their vision and growth potential. The strategy was designed to maximize impact with limited resources while building foundations for scale.",
    process: [
      {
        title: "Market Analysis",
        description:
          "In-depth research of market dynamics, competitor positioning, and customer needs in sustainable fintech.",
      },
      {
        title: "Positioning Development",
        description:
          "Creation of a distinctive market position and value proposition that highlighted Horizon's unique approach.",
      },
      {
        title: "Audience Segmentation",
        description:
          "Identification and prioritization of customer segments based on potential value and acquisition efficiency.",
      },
      {
        title: "Go-to-Market Planning",
        description:
          "Development of channel strategy, partnership approach, and launch roadmap to maximize initial impact.",
      },
      {
        title: "Narrative Development",
        description:
          "Creation of compelling brand story and messaging framework aligned with the positioning strategy.",
      },
      {
        title: "Pitch & Presentation",
        description:
          "Design of investor materials and customer presentations to articulate the vision and value proposition.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Market analysis" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Positioning framework" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Brand narrative" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Go-to-market strategy" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Investor pitch deck" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Launch event" },
    ],
    results: [
      {
        stat: "$4.2M",
        title: "Seed Funding Secured",
        description: "Successfully raised seed round from top-tier investors based on the strategic vision.",
      },
      {
        stat: "12K+",
        title: "Early Adopters",
        description: "Exceeded user acquisition targets in the first quarter after launch.",
      },
      {
        stat: "8",
        title: "Strategic Partnerships",
        description:
          "Secured key partnerships with established financial institutions and sustainability organizations.",
      },
    ],
    testimonial: {
      quote:
        "Sakib's strategic guidance was instrumental in our successful market entry. His ability to identify our unique value proposition and translate it into a compelling narrative gave us clarity and confidence. The positioning strategy and go-to-market plan provided a roadmap that helped us secure funding and gain early traction in a highly competitive space.",
      author: "Jessica Williams",
      position: "Founder, Horizon",
    },
  },
  {
    title: "Pulse E-commerce",
    slug: "pulse-ecommerce",
    category: "Digital Strategy",
    description: "E-commerce strategy and implementation for a fashion retailer.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2022",
    client: "Pulse Fashion",
    duration: "5 months",
    services: ["E-commerce Strategy", "UX/UI Design", "Conversion Optimization", "Analytics Setup"],
    overview:
      "Pulse, an established fashion retailer with a strong brick-and-mortar presence, needed to transform their underperforming e-commerce platform into a growth driver for the business. We developed a comprehensive e-commerce strategy and redesigned their digital shopping experience to increase online sales, improve customer engagement, and create a seamless omnichannel experience that complemented their physical stores.",
    challenge:
      "Despite having a loyal customer base in their physical stores, Pulse struggled to translate this success online. Their e-commerce platform suffered from poor user experience, low conversion rates, and high cart abandonment. The digital experience failed to capture the brand's unique aesthetic and shopping experience, and they lacked the data infrastructure to effectively measure performance and optimize the customer journey.",
    solution:
      "We created a holistic e-commerce transformation strategy that addressed both the customer-facing experience and the underlying business operations. This included a complete redesign of the online shopping experience with a focus on brand storytelling and conversion, implementation of a robust analytics framework, and development of an omnichannel strategy that connected the online and offline customer journeys. The solution was implemented in phases to allow for testing and optimization throughout the process.",
    process: [
      {
        title: "E-commerce Audit",
        description:
          "Comprehensive analysis of the existing platform, identifying usability issues and conversion barriers.",
      },
      {
        title: "Customer Research",
        description:
          "Interviews and surveys with existing customers to understand shopping preferences and pain points.",
      },
      {
        title: "Experience Design",
        description: "Creation of a new user experience that balanced brand storytelling with conversion optimization.",
      },
      {
        title: "Technical Implementation",
        description:
          "Platform development with focus on performance, mobile optimization, and integration with existing systems.",
      },
      {
        title: "Analytics Framework",
        description: "Implementation of comprehensive tracking and reporting to enable data-driven optimization.",
      },
      {
        title: "Launch & Optimization",
        description: "Phased rollout with continuous testing and refinement based on performance data.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "E-commerce homepage" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Product detail page" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Mobile shopping experience" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Checkout flow" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Email marketing" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Analytics dashboard" },
    ],
    results: [
      {
        stat: "187%",
        title: "Increase in Online Revenue",
        description: "Year-over-year growth in e-commerce sales following the platform relaunch.",
      },
      {
        stat: "3.2x",
        title: "Improvement in Conversion Rate",
        description: "Significant increase in the percentage of visitors completing purchases.",
      },
      {
        stat: "-42%",
        title: "Reduction in Cart Abandonment",
        description: "Substantial decrease in the rate of abandoned shopping carts through improved UX.",
      },
    ],
    testimonial: {
      quote:
        "The e-commerce transformation has been a game-changer for our business. What started as a website redesign evolved into a complete rethinking of how we engage with customers across channels. The strategic approach and attention to detail resulted in an online experience that truly captures our brand essence while driving significant business results.",
      author: "David Rodriguez",
      position: "COO, Pulse",
    },
  },
  {
    title: "Vertex Brand Identity",
    slug: "vertex-identity",
    category: "Brand Strategy",
    description: "Complete visual identity system for an architectural firm.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2023",
    client: "Vertex Architecture",
    duration: "4 months",
    services: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Marketing Collateral"],
    overview:
      "Vertex Architecture, an award-winning firm with a growing international portfolio, needed a brand identity that would reflect their innovative approach and position them for continued growth. We developed a comprehensive brand strategy and visual identity system that captured their unique perspective on architectural design and created a distinctive presence in a competitive market.",
    challenge:
      "Despite their impressive portfolio and reputation for innovative design, Vertex's brand identity failed to communicate their unique approach and vision. Their existing visual identity was inconsistent and outdated, lacking the sophistication expected of a leading architectural practice. As they expanded into new markets and pursued larger projects, they needed a brand that would effectively communicate their capabilities and design philosophy to diverse audiences.",
    solution:
      "We created a comprehensive brand identity system rooted in Vertex's design philosophy of 'purposeful innovation.' The visual system featured a dynamic logo that represented the intersection of creativity and precision, supported by a sophisticated color palette, typography, and graphic elements that reflected architectural principles. The identity was implemented across all touchpoints, from digital platforms to project proposals, creating a cohesive and memorable brand experience.",
    process: [
      {
        title: "Brand Discovery",
        description:
          "Workshops and interviews with leadership and team members to uncover the firm's values and vision.",
      },
      {
        title: "Competitive Analysis",
        description: "Research into positioning and visual approaches of leading architectural practices globally.",
      },
      {
        title: "Strategy Development",
        description: "Creation of brand positioning, narrative, and personality to guide the visual identity.",
      },
      {
        title: "Visual Identity Design",
        description:
          "Development of logo, color palette, typography, and graphic system reflecting architectural principles.",
      },
      {
        title: "Application Development",
        description: "Design of key touchpoints including website, portfolio presentations, and marketing materials.",
      },
      {
        title: "Guidelines & Implementation",
        description: "Creation of comprehensive brand guidelines and templates for consistent application.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Logo design" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Brand guidelines" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Website design" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Project portfolio" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Business cards" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Office signage" },
    ],
    results: [
      {
        stat: "3",
        title: "Major International Projects",
        description: "Secured significant new commissions following the rebrand launch.",
      },
      {
        stat: "86%",
        title: "Positive Client Feedback",
        description: "Overwhelmingly positive response from existing clients and industry peers.",
      },
      {
        stat: "52%",
        title: "Increase in Press Coverage",
        description: "Greater media interest and coverage of the firm and their projects.",
      },
    ],
    testimonial: {
      quote:
        "Our new brand identity perfectly captures the essence of our practice and has elevated our presence in the industry. The strategic thinking behind the visual system has given us a powerful platform to communicate our approach and vision. Since launching, we've seen tangible benefits in terms of client engagement and new business opportunities.",
      author: "Alexandra Torres",
      position: "Principal, Vertex Architecture",
    },
  },
  {
    title: "Quantum Positioning",
    slug: "quantum-positioning",
    category: "Consultancy",
    description: "Market positioning strategy for a financial services provider.",
    image: "/placeholder.svg?height=400&width=600",
    heroImage: "/placeholder.svg?height=800&width=1600",
    year: "2022",
    client: "Quantum Financial",
    duration: "3 months",
    services: ["Market Analysis", "Brand Positioning", "Messaging Strategy", "Internal Alignment"],
    overview:
      "Quantum Financial, an established financial services provider, was facing increasing competition and commoditization in their core markets. We developed a distinctive positioning strategy that identified untapped opportunities, differentiated their offerings, and aligned their organization around a compelling vision for the future. This strategic foundation enabled them to revitalize their brand and drive new growth.",
    challenge:
      "After years of steady growth, Quantum was experiencing market saturation and pressure from both traditional competitors and fintech disruptors. Their positioning had become generic, making it difficult to differentiate their offerings and command premium pricing. Internally, there was a lack of clarity about strategic direction, resulting in fragmented marketing efforts and inconsistent customer experiences across business units.",
    solution:
      "We developed a comprehensive positioning strategy that identified a distinctive space Quantum could own at the intersection of personalized service and technological innovation. This positioning was supported by a messaging framework that articulated their unique value proposition for different audience segments, and an internal alignment program to ensure consistent delivery across the organization. The strategy provided a foundation for revitalizing their brand and developing targeted growth initiatives.",
    process: [
      {
        title: "Market Analysis",
        description: "In-depth research into market trends, competitive positioning, and emerging customer needs.",
      },
      {
        title: "Customer Insights",
        description:
          "Interviews and surveys with current and prospective customers to understand perceptions and priorities.",
      },
      {
        title: "Positioning Development",
        description: "Creation of distinctive positioning options and testing with key stakeholders and customers.",
      },
      {
        title: "Messaging Framework",
        description:
          "Development of core narrative and tailored messaging for different audience segments and touchpoints.",
      },
      {
        title: "Internal Alignment",
        description: "Workshops and tools to ensure understanding and buy-in across the organization.",
      },
      {
        title: "Implementation Planning",
        description:
          "Creation of roadmap for activating the positioning across marketing, product, and customer experience.",
      },
    ],
    gallery: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Market analysis" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Positioning framework" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Customer journey map" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Messaging architecture" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Internal workshop" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Implementation roadmap" },
    ],
    results: [
      {
        stat: "24%",
        title: "Growth in High-Value Segments",
        description: "Increased acquisition and retention in strategically important customer segments.",
      },
      {
        stat: "18%",
        title: "Improvement in Price Realization",
        description: "Ability to command premium pricing based on clearer value differentiation.",
      },
      {
        stat: "92%",
        title: "Employee Understanding",
        description: "High level of internal clarity about positioning and individual role in delivering it.",
      },
    ],
    testimonial: {
      quote:
        "The positioning work gave us the strategic clarity we needed to revitalize our business in a challenging market. The process was rigorous yet practical, resulting in a positioning that is both distinctive and authentic to who we are. Most importantly, it has united our organization around a compelling vision and provided a clear direction for our growth initiatives.",
      author: "Robert Chen",
      position: "CEO, Quantum Financial",
    },
  },
]
