import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"

interface ServicePageProps {
  params: {
    slug: string
  }
}

const serviceData: Record<string, any> = {
  "brand-strategy": {
    title: "Brand Strategy",
    subtitle: "Strategic Brand Positioning & Development",
    description: "We develop comprehensive brand strategies that position your business for success in competitive markets. Our strategic approach is rooted in deep market understanding and audience insights.",
    hero: {
      title: "Transform Your Brand with Strategic Thinking",
      description: "Our brand strategy services help you define your unique position in the market, connect with your target audience, and build a foundation for sustainable growth.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Brand Positioning & Messaging",
      "Brand Architecture",
      "Competitive Analysis",
      "Audience Segmentation",
      "Brand Voice & Personality",
      "Value Proposition Development"
    ],
    process: [
      {
        title: "Research & Discovery",
        description: "We conduct comprehensive market research and competitive analysis to understand your landscape."
      },
      {
        title: "Strategy Development",
        description: "We develop your unique brand positioning and messaging framework."
      },
      {
        title: "Implementation Planning",
        description: "We create a roadmap for implementing your brand strategy across all touchpoints."
      },
      {
        title: "Measurement & Optimization",
        description: "We establish metrics and continuously optimize your brand performance."
      }
    ],
    benefits: [
      "Clear market differentiation",
      "Stronger customer connection",
      "Increased brand recognition",
      "Higher customer loyalty",
      "Improved marketing ROI",
      "Sustainable competitive advantage"
    ],
    deliverables: [
      "Brand Strategy Document",
      "Brand Positioning Statement",
      "Messaging Framework",
      "Brand Guidelines",
      "Implementation Roadmap",
      "Performance Metrics"
    ]
  },
  "digital-transformation": {
    title: "Digital Transformation",
    subtitle: "Digital Ecosystem Development",
    description: "We create digital ecosystems that amplify your brand's presence and engage audiences across platforms. Our digital strategies are designed to drive meaningful engagement and conversion.",
    hero: {
      title: "Accelerate Your Digital Evolution",
      description: "Transform your business with comprehensive digital solutions that enhance customer experience and drive growth in the digital age.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Digital Strategy Development",
      "Website & App Design",
      "E-commerce Solutions",
      "Digital Marketing Campaigns",
      "SEO & Content Strategy",
      "Analytics & Performance Tracking"
    ],
    process: [
      {
        title: "Digital Audit",
        description: "We assess your current digital presence and identify opportunities for improvement."
      },
      {
        title: "Strategy Design",
        description: "We create a comprehensive digital transformation roadmap tailored to your goals."
      },
      {
        title: "Implementation",
        description: "We execute the digital strategy across all platforms and touchpoints."
      },
      {
        title: "Optimization",
        description: "We continuously monitor and optimize performance for maximum impact."
      }
    ],
    benefits: [
      "Enhanced online presence",
      "Improved customer experience",
      "Increased digital engagement",
      "Higher conversion rates",
      "Better data insights",
      "Scalable digital infrastructure"
    ],
    deliverables: [
      "Digital Strategy Blueprint",
      "Website/App Development",
      "Digital Marketing Campaigns",
      "SEO Implementation",
      "Analytics Dashboard",
      "Performance Reports"
    ]
  },
  "creative-direction": {
    title: "Creative Direction",
    subtitle: "Strategic Creative Leadership",
    description: "We provide expert creative guidance to navigate complex brand challenges and identify growth opportunities. Our creative approach balances innovation with strategic objectives.",
    hero: {
      title: "Elevate Your Creative Vision",
      description: "Our creative direction services help you develop compelling visual narratives that resonate with your audience and differentiate your brand.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Creative Strategy Development",
      "Campaign Conceptualization",
      "Visual Storytelling",
      "Art Direction",
      "Brand Expression Guidelines",
      "Creative Team Leadership"
    ],
    process: [
      {
        title: "Creative Brief",
        description: "We develop a comprehensive creative brief that aligns with your strategic objectives."
      },
      {
        title: "Concept Development",
        description: "We create innovative concepts that bring your brand story to life."
      },
      {
        title: "Creative Execution",
        description: "We guide the execution of creative assets across all channels."
      },
      {
        title: "Performance Review",
        description: "We analyze creative performance and refine approaches for optimal impact."
      }
    ],
    benefits: [
      "Distinctive brand expression",
      "Consistent creative quality",
      "Enhanced brand storytelling",
      "Improved audience engagement",
      "Creative team alignment",
      "Measurable creative impact"
    ],
    deliverables: [
      "Creative Strategy Document",
      "Campaign Concepts",
      "Visual Style Guide",
      "Creative Assets",
      "Brand Expression Guidelines",
      "Creative Performance Reports"
    ]
  },
  "visual-identity": {
    title: "Visual Identity",
    subtitle: "Distinctive Visual System Design",
    description: "We craft distinctive visual systems that express your brand's personality and values across all touchpoints. Our visual identity work creates recognition and reinforces brand positioning.",
    hero: {
      title: "Create a Memorable Visual Identity",
      description: "Develop a cohesive visual system that captures your brand essence and creates lasting impressions across every customer interaction.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Logo & Identity Design",
      "Visual System Development",
      "Brand Guidelines",
      "Packaging Design",
      "Environmental Graphics",
      "Brand Collateral Design"
    ],
    process: [
      {
        title: "Brand Analysis",
        description: "We analyze your brand personality and values to inform visual direction."
      },
      {
        title: "Design Development",
        description: "We create distinctive visual elements that express your brand identity."
      },
      {
        title: "System Creation",
        description: "We develop a comprehensive visual system for consistent application."
      },
      {
        title: "Implementation Support",
        description: "We provide ongoing support to ensure consistent visual identity application."
      }
    ],
    benefits: [
      "Strong brand recognition",
      "Professional brand image",
      "Consistent visual communication",
      "Enhanced brand credibility",
      "Improved market positioning",
      "Scalable visual system"
    ],
    deliverables: [
      "Logo Design & Variations",
      "Visual Identity System",
      "Brand Guidelines Manual",
      "Business Collateral",
      "Digital Assets",
      "Implementation Templates"
    ]
  },
  "content-strategy": {
    title: "Content Strategy",
    subtitle: "Strategic Content Framework Development",
    description: "We develop strategic content frameworks that tell your brand story and engage your target audience effectively across all channels.",
    hero: {
      title: "Tell Your Story with Purpose",
      description: "Create compelling content strategies that engage your audience, build trust, and drive meaningful business results.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Content Strategy Development",
      "Editorial Calendar Planning",
      "Content Creation Guidelines",
      "Multi-channel Content Planning",
      "SEO Content Optimization",
      "Content Performance Analytics"
    ],
    process: [
      {
        title: "Content Audit",
        description: "We analyze your existing content and identify opportunities for improvement."
      },
      {
        title: "Strategy Development",
        description: "We create a comprehensive content strategy aligned with your business goals."
      },
      {
        title: "Content Planning",
        description: "We develop detailed content calendars and creation workflows."
      },
      {
        title: "Performance Optimization",
        description: "We continuously optimize content performance based on data insights."
      }
    ],
    benefits: [
      "Consistent brand messaging",
      "Improved audience engagement",
      "Higher search rankings",
      "Increased brand authority",
      "Better content ROI",
      "Streamlined content creation"
    ],
    deliverables: [
      "Content Strategy Document",
      "Editorial Calendar",
      "Content Guidelines",
      "SEO Content Framework",
      "Performance Metrics",
      "Content Templates"
    ]
  },
  "market-research": {
    title: "Market Research",
    subtitle: "Strategic Market Intelligence",
    description: "We conduct in-depth research to uncover insights that inform strategic decision-making and positioning in your market.",
    hero: {
      title: "Make Informed Strategic Decisions",
      description: "Gain deep market insights and competitive intelligence to guide your strategic decisions and identify growth opportunities.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Market Analysis & Trends",
      "Competitive Intelligence",
      "Consumer Behavior Research",
      "Industry Benchmarking",
      "Opportunity Identification",
      "Strategic Recommendations"
    ],
    process: [
      {
        title: "Research Planning",
        description: "We define research objectives and methodology tailored to your needs."
      },
      {
        title: "Data Collection",
        description: "We gather comprehensive market data from multiple reliable sources."
      },
      {
        title: "Analysis & Insights",
        description: "We analyze data to uncover actionable insights and opportunities."
      },
      {
        title: "Strategic Recommendations",
        description: "We provide strategic recommendations based on research findings."
      }
    ],
    benefits: [
      "Data-driven decision making",
      "Competitive advantage",
      "Market opportunity identification",
      "Risk mitigation",
      "Strategic positioning",
      "Investment optimization"
    ],
    deliverables: [
      "Market Research Report",
      "Competitive Analysis",
      "Consumer Insights",
      "Industry Benchmarks",
      "Opportunity Matrix",
      "Strategic Recommendations"
    ]
  },
  "ux-ui-design": {
    title: "UX/UI Design",
    subtitle: "User-Centered Digital Experiences",
    description: "We create intuitive digital experiences that balance user needs with business objectives, ensuring optimal usability and engagement.",
    hero: {
      title: "Design Experiences That Convert",
      description: "Create user-centered digital experiences that delight your customers and drive business results through thoughtful design.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "User Experience Research",
      "Interface Design",
      "Prototyping & Testing",
      "Responsive Design",
      "Accessibility Optimization",
      "Design System Development"
    ],
    process: [
      {
        title: "User Research",
        description: "We conduct user research to understand needs, behaviors, and pain points."
      },
      {
        title: "Design & Prototype",
        description: "We create wireframes, prototypes, and high-fidelity designs."
      },
      {
        title: "Testing & Iteration",
        description: "We test designs with users and iterate based on feedback."
      },
      {
        title: "Implementation Support",
        description: "We support development teams to ensure design integrity."
      }
    ],
    benefits: [
      "Improved user satisfaction",
      "Higher conversion rates",
      "Reduced development costs",
      "Better accessibility",
      "Consistent user experience",
      "Competitive differentiation"
    ],
    deliverables: [
      "User Research Report",
      "Wireframes & Prototypes",
      "UI Design System",
      "Responsive Designs",
      "Usability Test Results",
      "Design Documentation"
    ]
  },
  "social-media-strategy": {
    title: "Social Media Strategy",
    subtitle: "Strategic Social Engagement",
    description: "We build strategic social media approaches that build community, drive engagement, and amplify your brand message across platforms.",
    hero: {
      title: "Build Meaningful Social Connections",
      description: "Develop strategic social media presence that builds authentic relationships with your audience and drives business growth.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Social Media Strategy",
      "Content Planning & Creation",
      "Community Management",
      "Influencer Partnerships",
      "Social Advertising",
      "Performance Analytics"
    ],
    process: [
      {
        title: "Platform Analysis",
        description: "We analyze your current social presence and identify optimal platforms."
      },
      {
        title: "Strategy Development",
        description: "We create a comprehensive social media strategy and content plan."
      },
      {
        title: "Content Execution",
        description: "We execute content creation and community management strategies."
      },
      {
        title: "Performance Optimization",
        description: "We monitor performance and optimize strategies for maximum engagement."
      }
    ],
    benefits: [
      "Increased brand awareness",
      "Higher audience engagement",
      "Community building",
      "Lead generation",
      "Customer loyalty",
      "Social proof development"
    ],
    deliverables: [
      "Social Media Strategy",
      "Content Calendar",
      "Brand Voice Guidelines",
      "Community Guidelines",
      "Performance Reports",
      "Growth Recommendations"
    ]
  },
  "brand-workshops": {
    title: "Brand Workshops",
    subtitle: "Collaborative Brand Development",
    description: "We facilitate collaborative sessions to align stakeholders and define brand direction through structured workshops and strategic exercises.",
    hero: {
      title: "Align Your Team Around Your Brand",
      description: "Bring stakeholders together to define your brand vision, values, and strategy through facilitated workshops and collaborative exercises.",
      image: "/placeholder.svg?height=600&width=800"
    },
    features: [
      "Brand Vision Workshops",
      "Stakeholder Alignment",
      "Brand Values Definition",
      "Strategic Planning Sessions",
      "Creative Brainstorming",
      "Implementation Planning"
    ],
    process: [
      {
        title: "Workshop Planning",
        description: "We design customized workshops based on your specific objectives and stakeholders."
      },
      {
        title: "Facilitation",
        description: "We facilitate engaging sessions that drive alignment and strategic thinking."
      },
      {
        title: "Synthesis",
        description: "We synthesize workshop outputs into actionable strategic frameworks."
      },
      {
        title: "Follow-up Planning",
        description: "We create implementation plans to execute workshop outcomes."
      }
    ],
    benefits: [
      "Stakeholder alignment",
      "Clear brand direction",
      "Team engagement",
      "Accelerated decision making",
      "Shared understanding",
      "Implementation readiness"
    ],
    deliverables: [
      "Workshop Facilitation",
      "Strategic Frameworks",
      "Brand Definition Documents",
      "Implementation Roadmap",
      "Stakeholder Alignment Report",
      "Follow-up Action Plans"
    ]
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = serviceData[params.slug]

  if (!service) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12">
            <ScrollReveal>
              <Link
                href="/services"
                className="inline-flex items-center text-[#FF5001] hover:text-[#FF5001]/80 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Link>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
                    {service.subtitle}
                  </span>
                </ScrollReveal>
                <TextReveal
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6"
                  mobileType="words"
                  mobileStaggerDelay={0.03}
                >
                  {service.hero.title}
                </TextReveal>
                <ScrollReveal delay={0.3}>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8">
                    {service.hero.description}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/portfolio"
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center"
                    >
                      View Examples
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.2} animation="fade-slide" direction="left">
                <div className="relative rounded-2xl overflow-hidden">
                  <ImageReveal
                    src={service.hero.image}
                    alt={service.title}
                    width={800}
                    height={600}
                    className="w-full"
                    direction="right"
                    mobileDirection="bottom"
                  />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="What's Included"
                title="Service Features"
                description="Comprehensive solutions designed to address your specific needs and drive measurable results."
                size="medium"
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                staggerDelay={0.1}
              >
                {service.features.map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="bg-[#212121] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#FF5001]/30 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-[#FF5001] mb-4" />
                    <h3 className="text-lg font-semibold">{feature}</h3>
                  </div>
                ))}
              </StaggerReveal>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Our Process"
                title="How We Work"
                description="Our proven methodology ensures successful outcomes through systematic approach and collaboration."
                size="medium"
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
                staggerDelay={0.15}
              >
                {service.process.map((step: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-[#FF5001]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <span className="text-[#FF5001] font-bold text-xl">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-[#E9E7E2]/70">{step.description}</p>
                  </div>
                ))}
              </StaggerReveal>
            </div>
          </section>

          {/* Benefits & Deliverables */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                <ScrollReveal>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8">Key Benefits</h2>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[#FF5001] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-[#E9E7E2]/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8">Deliverables</h2>
                  <ul className="space-y-4">
                    {service.deliverables.map((deliverable: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[#FF5001] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-[#E9E7E2]/90">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal
                className="bg-[#212121] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
                delay={0.2}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Ready to Start?</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    Let's Discuss Your {service.title} Needs
                  </h2>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8 md:mb-10">
                    Get in touch to learn how our {service.title.toLowerCase()} services can help transform your business and achieve your goals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                    >
                      Start Your Project
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/services"
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({
    slug,
  }))
}