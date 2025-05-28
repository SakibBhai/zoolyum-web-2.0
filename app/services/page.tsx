"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCard3D } from "@/components/service-card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Our Services"
              title="Strategic Brand & Digital Solutions"
              description="We offer comprehensive services to elevate your brand and drive business growth through strategic thinking and creative excellence."
              titleGradient={true}
            />

            <StaggerReveal
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-16"
              staggerDelay={0.1}
              mobileStaggerDelay={0.05}
              animation="fade-slide"
              mobileAnimation="fade"
            >
              <ServiceCard3D
                title="Brand Strategy"
                description="Developing comprehensive brand strategies that position your business for success in competitive markets."
                icon="strategy"
              />
              <ServiceCard3D
                title="Digital Transformation"
                description="Creating digital ecosystems that amplify your brand's presence and engage audiences across platforms."
                icon="globe"
              />
              <ServiceCard3D
                title="Creative Direction"
                description="Providing expert guidance to navigate complex brand challenges and identify growth opportunities."
                icon="compass"
              />
              <ServiceCard3D
                title="Visual Identity"
                description="Crafting distinctive visual systems that express your brand's personality and values across all touchpoints."
                icon="palette"
              />
              <ServiceCard3D
                title="Content Strategy"
                description="Developing strategic content frameworks that tell your brand story and engage your target audience."
                icon="file-text"
              />
              <ServiceCard3D
                title="Market Research"
                description="Conducting in-depth research to uncover insights that inform strategic decision-making and positioning."
                icon="search"
              />
              <ServiceCard3D
                title="UX/UI Design"
                description="Creating intuitive digital experiences that balance user needs with business objectives."
                icon="layout"
              />
              <ServiceCard3D
                title="Social Media Strategy"
                description="Building strategic social media approaches that build community and drive engagement."
                icon="share-2"
              />
              <ServiceCard3D
                title="Brand Workshops"
                description="Facilitating collaborative sessions to align stakeholders and define brand direction."
                icon="users"
              />
            </StaggerReveal>
          </section>

          {/* Service Details Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Our Expertise"
                title="Detailed Service Offerings"
                description="Explore our core service areas in depth to understand how we can help transform your brand."
                size="medium"
              />

              <div className="mt-12 md:mt-16 space-y-16 md:space-y-24">
                {/* Brand Strategy */}
                <ServiceDetail
                  title="Brand Strategy"
                  description="We develop comprehensive brand strategies that position your business for success in competitive markets. Our strategic approach is rooted in deep market understanding and audience insights."
                  features={[
                    "Brand Positioning & Messaging",
                    "Brand Architecture",
                    "Competitive Analysis",
                    "Audience Segmentation",
                    "Brand Voice & Personality",
                    "Value Proposition Development",
                  ]}
                  image="/placeholder.svg?height=400&width=600"
                  reverse={false}
                />

                {/* Digital Transformation */}
                <ServiceDetail
                  title="Digital Transformation"
                  description="We create digital ecosystems that amplify your brand's presence and engage audiences across platforms. Our digital strategies are designed to drive meaningful engagement and conversion."
                  features={[
                    "Digital Strategy Development",
                    "Website & App Design",
                    "E-commerce Solutions",
                    "Digital Marketing Campaigns",
                    "SEO & Content Strategy",
                    "Analytics & Performance Tracking",
                  ]}
                  image="/placeholder.svg?height=400&width=600"
                  reverse={true}
                />

                {/* Creative Direction */}
                <ServiceDetail
                  title="Creative Direction"
                  description="We provide expert creative guidance to navigate complex brand challenges and identify growth opportunities. Our creative approach balances innovation with strategic objectives."
                  features={[
                    "Creative Strategy Development",
                    "Campaign Conceptualization",
                    "Visual Storytelling",
                    "Art Direction",
                    "Brand Expression Guidelines",
                    "Creative Team Leadership",
                  ]}
                  image="/placeholder.svg?height=400&width=600"
                  reverse={false}
                />

                {/* Visual Identity */}
                <ServiceDetail
                  title="Visual Identity"
                  description="We craft distinctive visual systems that express your brand's personality and values across all touchpoints. Our visual identity work creates recognition and reinforces brand positioning."
                  features={[
                    "Logo & Identity Design",
                    "Visual System Development",
                    "Brand Guidelines",
                    "Packaging Design",
                    "Environmental Graphics",
                    "Brand Collateral Design",
                  ]}
                  image="/placeholder.svg?height=400&width=600"
                  reverse={true}
                />
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Our Approach"
                title="The Four-Step Alchemy Process"
                description="Our systematic approach transforms ordinary brands into extraordinary market forces through a proven methodology."
                size="medium"
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 md:mt-16"
                staggerDelay={0.15}
                mobileStaggerDelay={0.08}
              >
                {processSteps.map((step, index) => (
                  <ProcessStep key={index} step={step} />
                ))}
              </StaggerReveal>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <ScrollReveal
                className="bg-[#212121] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
                delay={0.2}
                mobileAnimation="fade"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Get Started</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    Ready to Transform Your Brand?
                  </h2>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8 md:mb-10">
                    Let's collaborate to create a strategic brand experience that resonates with your audience and
                    drives meaningful results for your business.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Contact"
                    >
                      Start Your Project
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/portfolio"
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Portfolio"
                    >
                      View Our Portfolio
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
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

interface ProcessStepProps {
  step: {
    number: string
    title: string
    description: string
  }
}

function ProcessStep({ step }: ProcessStepProps) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#FF5001]/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-[#FF5001] font-bold text-xl">{step.number}</span>
        </div>
        <h3 className="text-xl font-bold mb-4">{step.title}</h3>
        <p className="text-[#E9E7E2]/70">{step.description}</p>
      </div>
    </div>
  )
}

interface ServiceDetailProps {
  title: string
  description: string
  features: string[]
  image: string
  reverse?: boolean
}

function ServiceDetail({ title, description, features, image, reverse = false }: ServiceDetailProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? "md:flex-row-reverse" : ""}`}>
      <ScrollReveal animation="fade-slide" direction={reverse ? "left" : "right"} mobileAnimation="fade">
        <div className="relative rounded-2xl overflow-hidden">
          <ImageReveal
            src={image || "/placeholder.svg"}
            alt={title}
            width={600}
            height={400}
            className="w-full"
            direction={reverse ? "right" : "left"}
            mobileDirection="bottom"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal
        animation="fade-slide"
        direction={reverse ? "right" : "left"}
        delay={0.2}
        mobileAnimation="fade"
        mobileDelay={0.1}
      >
        <TextReveal className="text-2xl md:text-3xl font-bold mb-4" mobileType="words" mobileStaggerDelay={0.02}>
          {title}
        </TextReveal>
        <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-6">{description}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-[#FF5001] mr-2">•</span>
              <span className="text-[#E9E7E2]/90">{feature}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </div>
  )
}

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We dive deep into your brand, market, and audience to uncover insights that inform our strategy.",
  },
  {
    number: "02",
    title: "Define",
    description: "We define your unique positioning, value proposition, and strategic direction.",
  },
  {
    number: "03",
    title: "Design",
    description: "We craft the visual and verbal elements that bring your brand strategy to life.",
  },
  {
    number: "04",
    title: "Deliver",
    description: "We implement the strategy across all touchpoints and measure results for continuous improvement.",
  },
]
