"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"
import { PageHeadline } from "@/components/page-headline"
import { CounterAnimation } from "@/components/scroll-animations/counter-animation"
import { TeamMemberCard } from "@/components/team-member-card"
import { useState, useEffect } from "react"

interface Statistic {
  label: string;
  value: string;
  suffix: string;
  order: number;
}

interface AboutPageData {
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  story_title: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  story_paragraph_3: string;
  story_image_url: string;
  mission_title: string;
  mission_content: string;
  values: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  team_eyebrow: string;
  team_title: string;
  team_description: string;
  cta_eyebrow: string;
  cta_title: string;
  cta_description: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
}

const defaultAboutData: AboutPageData = {
  hero_eyebrow: "About Us",
  hero_title: "Strategic Brand Alchemy for Modern Businesses",
  hero_description: "Zoolyum is a full-service brand strategy agency dedicated to transforming businesses into powerful market forces through strategic thinking and creative excellence.",
  hero_image_url: "/placeholder.svg?height=600&width=1200",
  story_title: "From Vision to Reality",
  story_paragraph_1: "Founded in 2013 by Sakib Chowdhury, Zoolyum began with a simple yet powerful vision: to help brands unlock their full potential through strategic thinking and creative excellence.",
  story_paragraph_2: "What started as a one-person consultancy has grown into a diverse team of strategists, designers, and digital experts united by a passion for transforming brands. Over the years, we've evolved our approach and expanded our capabilities, but our core mission remains unchanged.",
  story_paragraph_3: "Today, Zoolyum works with ambitious businesses across industries, from emerging startups to established enterprises, helping them navigate complex market challenges and seize new opportunities for growth.",
  story_image_url: "/placeholder.svg?height=600&width=500",
  mission_title: "Our Mission",
  mission_content: "To transform brands through strategic thinking and creative excellence, creating meaningful connections between businesses and their audiences that drive sustainable growth.",
  values: [
    {
      number: "01",
      title: "Strategic Excellence",
      description: "We believe in the power of strategic thinking to solve complex brand challenges and create meaningful impact."
    },
    {
      number: "02",
      title: "Creative Courage",
      description: "We embrace bold ideas and innovative approaches that help brands stand out in crowded markets."
    },
    {
      number: "03",
      title: "Collaborative Partnership",
      description: "We work as an extension of our clients' teams, fostering open communication and shared success."
    },
    {
      number: "04",
      title: "Measurable Impact",
      description: "We focus on creating work that delivers tangible results and drives business growth."
    }
  ],
  team_eyebrow: "Our Team",
  team_title: "Meet the Strategists & Creatives",
  team_description: "Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.",
  cta_eyebrow: "Work With Us",
  cta_title: "Ready to Transform Your Brand?",
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
  cta_primary_text: "Start Your Project",
  cta_primary_url: "/contact",
  cta_secondary_text: "Explore Our Services",
  cta_secondary_url: "/services"
}

export default function AboutPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([
    { label: "Years Experience", value: "50", suffix: "+", order: 1 },
    { label: "Projects Completed", value: "30", suffix: "+", order: 2 },
    { label: "Happy Clients", value: "5", suffix: "+", order: 3 },
    { label: "Industry Awards", value: "5", suffix: "", order: 4 }
  ]);

  const [aboutData, setAboutData] = useState<AboutPageData>(defaultAboutData);

  // Fetch statistics from API
  useEffect(() => {
    fetch('/api/homepage/statistics')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStatistics(data);
        }
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        // Keep default values on error
      });
  }, []);

  // Fetch about page data from API
  useEffect(() => {
    fetch('/api/admin/about-page')
      .then(res => res.json())
      .then(data => {
        if (data.hero_title) {
          setAboutData(data);
        }
      })
      .catch(error => {
        console.error('Error fetching about page:', error);
        // Keep default values on error
      });
  }, []);
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow={aboutData.hero_eyebrow}
              title={aboutData.hero_title}
              description={aboutData.hero_description}
              titleGradient={true}
            />

            <div className="mt-12 md:mt-16">
              <div className="relative rounded-2xl overflow-hidden">
                <ImageReveal
                  src={aboutData.hero_image_url}
                  alt="Zoolyum Agency Team"
                  width={1200}
                  height={600}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fade-slide" direction="right" mobileAnimation="fade">
                <div className="relative">
                  <div className="relative z-10 rounded-2xl overflow-hidden">
                    <ImageReveal
                      src={aboutData.story_image_url}
                      alt="Zoolyum Agency Office"
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
                <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">Our Story</span>
                <TextReveal
                  className="text-3xl md:text-4xl font-bold mt-2 mb-6"
                  mobileType="words"
                  mobileStaggerDelay={0.02}
                >
                  {aboutData.story_title}
                </TextReveal>
                <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-4">
                  {aboutData.story_paragraph_1}
                </p>
                <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-4">
                  {aboutData.story_paragraph_2}
                </p>
                <p className="text-base md:text-lg text-[#E9E7E2]/80">
                  {aboutData.story_paragraph_3}
                </p>
              </ScrollReveal>
            </div>
          </section>

          {/* Mission & Values Section */}
          <section className="bg-[#1A1A1A] py-16 md:py-24">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Mission & Values"
                title="What Drives Us Forward"
                description="Our mission and values form the foundation of everything we do at Zoolyum, guiding our approach to client partnerships and creative work."
                size="medium"
              />

              <div className="grid md:grid-cols-2 gap-12 mt-12 md:mt-16">
                <ScrollReveal animation="fade-slide" direction="right" mobileAnimation="fade">
                  <div className="bg-[#212121] p-8 rounded-2xl h-full">
                    <h3 className="text-2xl font-bold mb-4">{aboutData.mission_title}</h3>
                    <p className="text-[#E9E7E2]/80 whitespace-pre-line">
                      {aboutData.mission_content}
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-slide" direction="left" delay={0.2} mobileAnimation="fade">
                  <div className="bg-[#212121] p-8 rounded-2xl h-full">
                    <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                    <ul className="space-y-4">
                      {aboutData.values.map((value, index) => (
                        <li key={index} className="flex">
                          <span className="text-[#FF5001] mr-3 font-bold">{value.number}.</span>
                          <div>
                            <h4 className="font-bold mb-1">{value.title}</h4>
                            <p className="text-[#E9E7E2]/80">
                              {value.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {statistics.map((stat, index) => (
                  <StaggerReveal key={stat.order} staggerDelay={0.1 * (index + 1)} mobileStaggerDelay={0.05 * (index + 1)}>
                    <div className="text-center p-8 bg-[#1A1A1A] rounded-2xl">
                      <CounterAnimation
                        end={parseInt(stat.value) || 0}
                        suffix={stat.suffix}
                        className="text-4xl md:text-5xl font-bold text-[#FF5001]"
                        duration={2}
                      />
                      <p className="text-lg mt-3">{stat.label}</p>
                    </div>
                  </StaggerReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow={aboutData.team_eyebrow}
                title={aboutData.team_title}
                description={aboutData.team_description}
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                <TeamMemberCard
                  name="Sakib Chowdhury"
                  role="Founder & Creative Director"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Sakib brings over 15 years of experience in brand strategy and creative direction, having worked with global brands across diverse industries."
                />
                <TeamMemberCard
                  name="Emma Rodriguez"
                  role="Brand Strategist"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Emma specializes in developing comprehensive brand strategies that position businesses for success in competitive markets."
                />
                <TeamMemberCard
                  name="David Chen"
                  role="Digital Director"
                  image="/placeholder.svg?height=400&width=300"
                  bio="David leads our digital transformation initiatives, creating innovative digital ecosystems that amplify brand presence."
                />
                <TeamMemberCard
                  name="Sarah Johnson"
                  role="Client Relations"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Sarah ensures our client partnerships thrive through exceptional communication and project management."
                />
                <TeamMemberCard
                  name="Michael Torres"
                  role="Design Lead"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Michael crafts distinctive visual identities that express brand personalities across all touchpoints."
                />
                <TeamMemberCard
                  name="Aisha Patel"
                  role="Content Strategist"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Aisha develops strategic content frameworks that tell compelling brand stories and engage target audiences."
                />
                <TeamMemberCard
                  name="James Wilson"
                  role="UX Director"
                  image="/placeholder.svg?height=400&width=300"
                  bio="James creates intuitive digital experiences that balance user needs with business objectives."
                />
                <TeamMemberCard
                  name="Olivia Kim"
                  role="Market Researcher"
                  image="/placeholder.svg?height=400&width=300"
                  bio="Olivia uncovers insights that inform strategic decision-making and positioning through in-depth research."
                />
              </StaggerReveal>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="bg-[#212121] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">{aboutData.cta_eyebrow}</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    {aboutData.cta_title}
                  </h2>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8 md:mb-10">
                    {aboutData.cta_description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={aboutData.cta_primary_url}
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Contact"
                    >
                      {aboutData.cta_primary_text}
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href={aboutData.cta_secondary_url}
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Services"
                    >
                      {aboutData.cta_secondary_text}
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
