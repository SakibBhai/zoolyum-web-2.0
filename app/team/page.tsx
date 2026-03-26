"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TeamMemberCard } from "@/components/team-member-card"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { useState, useEffect } from "react"

interface TeamMember {
  id: string
  name: string
  designation: string | null
  bio: string | null
  imageUrl: string | null
  email: string | null
  linkedin: string | null
  twitter: string | null
  featured: boolean
  status: string
}

interface TeamPageConfig {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  hero_image_url: string
  leadership_eyebrow: string
  leadership_title: string
  leadership_description: string
  team_eyebrow: string
  team_title: string
  team_description: string
  culture_title: string
  culture_paragraph_1: string
  culture_paragraph_2: string
  culture_paragraph_3: string
  culture_image_url: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultConfig: TeamPageConfig = {
  hero_eyebrow: "Our Team",
  hero_title: "Meet the Strategists & Creatives",
  hero_description: "Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.",
  hero_image_url: "/placeholder.svg?height=600&width=1200",
  leadership_eyebrow: "Leadership",
  leadership_title: "Our Leadership Team",
  leadership_description: "Meet the visionaries guiding our agency's strategic direction and creative excellence.",
  team_eyebrow: "Our Experts",
  team_title: "The Full Zoolyum Team",
  team_description: "Our talented team of strategists, designers, and digital experts work collaboratively to deliver exceptional results.",
  culture_title: "Collaborative Innovation",
  culture_paragraph_1: "At Zoolyum, we foster a culture of collaborative innovation where diverse perspectives come together to create exceptional work.",
  culture_paragraph_2: "Our team is united by a passion for strategic thinking and creative excellence. We're curious, ambitious, and committed to continuous learning and growth.",
  culture_paragraph_3: "We're always looking for talented individuals who share our values and passion for transforming brands.",
  culture_image_url: "/placeholder.svg?height=600&width=500",
  cta_title: "Ready to Transform Your Brand?",
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
  cta_primary_text: "Start Your Project",
  cta_primary_url: "/contact",
  cta_secondary_text: "View Our Portfolio",
  cta_secondary_url: "/portfolio"
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pageConfig, setPageConfig] = useState<TeamPageConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch team members
    console.log('=== FETCHING TEAM MEMBERS ===')
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        console.log('Raw team data received:', data)
        console.log('Data type:', typeof data)
        console.log('Is array:', Array.isArray(data))
        console.log('Data length:', Array.isArray(data) ? data.length : 'N/A')

        if (Array.isArray(data)) {
          const activeMembers = data.filter(member => member.status === 'ACTIVE')
          console.log('Active members found:', activeMembers.length)
          console.log('Active members:', activeMembers.map(m => ({ name: m.name, designation: m.designation, featured: m.featured })))
          setTeamMembers(activeMembers)
        } else {
          console.error('Expected array but got:', typeof data)
        }
      })
      .catch(error => {
        console.error('Error fetching team members:', error)
      })

    // Fetch page configuration
    fetch('/api/admin/team-page')
      .then(res => res.json())
      .then(config => {
        console.log('Team page config fetched:', config)
        setPageConfig(config)
      })
      .catch(error => {
        console.error('Error fetching team page config:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const featuredMembers = teamMembers.filter(member => member.featured)
  const regularMembers = teamMembers.filter(member => !member.featured)
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow={pageConfig.hero_eyebrow}
              title={pageConfig.hero_title}
              description={pageConfig.hero_description}
              titleGradient={true}
            />

            <div className="mt-12 md:mt-16">
              <div className="relative rounded-2xl overflow-hidden">
                <ImageReveal
                  src={pageConfig.hero_image_url}
                  alt="Zoolyum Agency Team"
                  width={1200}
                  height={600}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Leadership Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow={pageConfig.leadership_eyebrow}
                title={pageConfig.leadership_title}
                description={pageConfig.leadership_description}
                size="medium"
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-16"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                {loading ? (
                  <p className="text-[#E9E7E2]/70">Loading team members...</p>
                ) : featuredMembers.length > 0 ? (
                  featuredMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      name={member.name}
                      role={member.designation || "Team Member"}
                      image={member.imageUrl || "/placeholder.svg?height=400&width=300"}
                      bio={member.bio || ""}
                      social={{
                        linkedin: member.linkedin || "",
                        twitter: member.twitter || "",
                      }}
                      featured={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#E9E7E2]/70 mb-2">No featured team members found.</p>
                    <p className="text-[#E9E7E2]/50 text-sm">
                      Mark team members as "featured" in the admin panel to display them here.
                    </p>
                  </div>
                )}
              </StaggerReveal>
            </div>
          </section>

          {/* Team Members Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow={pageConfig.team_eyebrow}
                title={pageConfig.team_title}
                description={pageConfig.team_description}
                size="medium"
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                {loading ? (
                  <p className="text-[#E9E7E2]/70">Loading team members...</p>
                ) : regularMembers.length > 0 ? (
                  regularMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      name={member.name}
                      role={member.designation || "Team Member"}
                      image={member.imageUrl || "/placeholder.svg?height=400&width=300"}
                      bio={member.bio || ""}
                      social={{
                        linkedin: member.linkedin || "",
                        twitter: member.twitter || "",
                      }}
                    />
                  ))
                ) : (
                  <p className="text-[#E9E7E2]/70">No team members found.</p>
                )}
              </StaggerReveal>
            </div>
          </section>

          {/* Culture Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <ScrollReveal animation="fade-slide" direction="right" mobileAnimation="fade">
                  <div className="relative">
                    <div className="relative z-10 rounded-2xl overflow-hidden">
                      <ImageReveal
                        src={pageConfig.culture_image_url}
                        alt="Zoolyum Agency Culture"
                        width={500}
                        height={600}
                        direction="left"
                        mobileDirection="bottom"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-40 md:w-64 h-40 md:h-64 bg-[#FF5001]/20 rounded-full filter blur-xl z-0"></div>
                    <div className="absolute -top-6 -left-6 w-24 md:w-32 h-24 md:h-32 bg-[#FF5001]/10 rounded-full filter blur-lg z-0"></div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-slide" direction="left" delay={0.2} mobileAnimation="fade">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Our Culture</span>
                  <TextReveal
                    className="text-3xl md:text-4xl font-bold mt-2 mb-6"
                    mobileType="words"
                    mobileStaggerDelay={0.02}
                  >
                    {pageConfig.culture_title}
                  </TextReveal>
                  <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-4">
                    {pageConfig.culture_paragraph_1}
                  </p>
                  <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-4">
                    {pageConfig.culture_paragraph_2}
                  </p>
                  <p className="text-base md:text-lg text-[#E9E7E2]/80">
                    {pageConfig.culture_paragraph_3}
                  </p>

                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                      data-cursor="button"
                      data-cursor-text="Join Us"
                    >
                      Join Our Team
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="bg-[#212121] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Work With Us</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    {pageConfig.cta_title}
                  </h2>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8 md:mb-10">
                    {pageConfig.cta_description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={pageConfig.cta_primary_url}
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Contact"
                    >
                      {pageConfig.cta_primary_text}
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href={pageConfig.cta_secondary_url}
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Portfolio"
                    >
                      {pageConfig.cta_secondary_text}
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}
