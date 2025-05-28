"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollIndicator } from "@/components/scroll-animations/scroll-indicator"
import { ServiceCard3D } from "@/components/service-card-3d"
import { TestimonialCard3D } from "@/components/testimonial-card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PageHeadline } from "@/components/page-headline"
import { TeamMemberCard } from "@/components/team-member-card"
import { CounterAnimation } from "@/components/scroll-animations/counter-animation"

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />
        <ScrollIndicator />

        <main>
          {/* Hero Section */}
          <section className="min-h-[90vh] md:min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
            <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-4 md:mb-6"
              >
                <span className="text-[#FF5001] text-base md:text-lg uppercase tracking-widest font-medium">
                  Brand Strategy & Digital Innovation
                </span>
              </motion.div>

              <AgencyNameAnimation />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 2.5 : 3.5, duration: 0.8 }}
                className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto text-[#E9E7E2]/80"
              >
                We transform brands through strategic thinking and creative excellence, crafting digital experiences
                that resonate and inspire action.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 3 : 4, duration: 0.8 }}
                className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/contact"
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                  data-cursor="button"
                  data-cursor-text="Connect"
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
                  View Our Work
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Background elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/4 left-1/4 w-40 md:w-64 h-40 md:h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>
            </div>
          </section>

          {/* Services Preview Section */}
          <section id="services-preview" className="bg-[#1A1A1A]">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <PageHeadline
                eyebrow="Our Expertise"
                title="Strategic Services for Modern Brands"
                description="We offer comprehensive solutions to elevate your brand and drive business growth through strategic thinking and creative excellence."
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
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
              </StaggerReveal>

              <ScrollReveal className="mt-10 md:mt-12 text-center" delay={0.3} mobileDelay={0.2} mobileAnimation="fade">
                <Link
                  href="/services"
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                  data-cursor="button"
                  data-cursor-text="View Services"
                >
                  Explore All Services
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </section>

          {/* About Preview Section */}
          <section id="about-preview">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <ScrollReveal animation="fade-slide" direction="right" mobileAnimation="fade">
                  <div className="relative">
                    <div className="relative z-10 rounded-2xl overflow-hidden">
                      <ImageReveal
                        src="/placeholder.svg?height=600&width=500"
                        alt="Zoolyum Agency"
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

                <ScrollReveal
                  animation="fade-slide"
                  direction="left"
                  delay={0.2}
                  mobileAnimation="fade"
                  mobileDelay={0.1}
                >
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">About Zoolyum</span>
                  <TextReveal
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6 md:mb-8"
                    mobileType="words"
                    mobileStaggerDelay={0.02}
                  >
                    Strategic <span className="headline-highlight">Brand Alchemy</span> for Growth
                  </TextReveal>
                  <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-4 md:mb-6">
                    Zoolyum is a strategic brand agency that transforms businesses into powerful market forces. We blend
                    analytical precision with creative intuition to create brand experiences that capture attention and
                    forge lasting connections with audiences.
                  </p>
                  <p className="text-base md:text-lg text-[#E9E7E2]/80 mb-6 md:mb-8">
                    Our approach is rooted in the belief that exceptional brands are built on strategic foundations and
                    brought to life through compelling storytelling and innovative design. We partner with ambitious
                    businesses ready to elevate their market presence and drive meaningful growth.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
                    <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                      <CounterAnimation
                        end={10}
                        suffix="+"
                        className="text-2xl md:text-3xl font-bold text-[#FF5001]"
                        duration={2}
                      />
                      <p className="text-sm mt-2">Years Experience</p>
                    </div>
                    <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                      <CounterAnimation
                        end={50}
                        suffix="+"
                        className="text-2xl md:text-3xl font-bold text-[#FF5001]"
                        duration={2}
                      />
                      <p className="text-sm mt-2">Projects Completed</p>
                    </div>
                    <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                      <CounterAnimation
                        end={30}
                        suffix="+"
                        className="text-2xl md:text-3xl font-bold text-[#FF5001]"
                        duration={2}
                      />
                      <p className="text-sm mt-2">Happy Clients</p>
                    </div>
                    <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                      <CounterAnimation
                        end={5}
                        className="text-2xl md:text-3xl font-bold text-[#FF5001]"
                        duration={2}
                      />
                      <p className="text-sm mt-2">Industry Awards</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/about"
                      className="inline-flex items-center text-[#FF5001] font-medium hover:underline group"
                      data-cursor="link"
                      data-cursor-text="About Us"
                    >
                      Learn more about our agency
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Portfolio Preview Section */}
          <section id="portfolio-preview" className="bg-[#1A1A1A]">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <PageHeadline
                eyebrow="Featured Work"
                title="Strategic Brand Transformations"
                description="Explore a selection of our most impactful projects that have helped businesses achieve remarkable growth and market presence."
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                <PortfolioItem
                  title="Nexus Rebrand"
                  category="Brand Strategy"
                  image="/placeholder.svg?height=400&width=600"
                />
                <PortfolioItem
                  title="Elevate Digital Transformation"
                  category="Digital Strategy"
                  image="/placeholder.svg?height=400&width=600"
                />
                <PortfolioItem
                  title="Horizon Market Entry"
                  category="Consultancy"
                  image="/placeholder.svg?height=400&width=600"
                />
              </StaggerReveal>

              <ScrollReveal className="mt-10 md:mt-12 text-center" delay={0.3} mobileDelay={0.2} mobileAnimation="fade">
                <Link
                  href="/portfolio"
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                  data-cursor="button"
                  data-cursor-text="View Portfolio"
                >
                  View Full Portfolio
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </section>

          {/* Team Preview Section */}
          <section id="team-preview">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <PageHeadline
                eyebrow="Our Team"
                title="Meet the Strategists & Creatives"
                description="Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients."
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                <TeamMemberCard
                  name="Sakib Chowdhury"
                  role="Founder & Creative Director"
                  image="/placeholder.svg?height=400&width=300"
                />
                <TeamMemberCard
                  name="Emma Rodriguez"
                  role="Brand Strategist"
                  image="/placeholder.svg?height=400&width=300"
                />
                <TeamMemberCard
                  name="David Chen"
                  role="Digital Director"
                  image="/placeholder.svg?height=400&width=300"
                />
                <TeamMemberCard
                  name="Sarah Johnson"
                  role="Client Relations"
                  image="/placeholder.svg?height=400&width=300"
                />
              </StaggerReveal>

              <ScrollReveal className="mt-10 md:mt-12 text-center" delay={0.3} mobileDelay={0.2} mobileAnimation="fade">
                <Link
                  href="/team"
                  className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center group"
                  data-cursor="button"
                  data-cursor-text="Meet Team"
                >
                  Meet Our Full Team
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="bg-[#1A1A1A]">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <PageHeadline
                eyebrow="Client Success"
                title="What Our Clients Say"
                description="Hear from the brands and businesses that have experienced the transformative power of our strategic approach."
              />

              <StaggerReveal
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
                mobileAnimation="fade"
              >
                <TestimonialCard3D
                  quote="Zoolyum's strategic approach completely transformed our brand positioning. Their insights helped us connect with our audience in ways we never thought possible."
                  author="Sarah Johnson"
                  company="CEO, Nexus Technologies"
                />
                <TestimonialCard3D
                  quote="Working with Zoolyum was a game-changer for our digital presence. The strategic vision and creative execution exceeded our expectations at every turn."
                  author="Michael Chen"
                  company="Marketing Director, Elevate"
                />
              </StaggerReveal>

              <ScrollReveal className="mt-10 md:mt-12 text-center" delay={0.3} mobileDelay={0.2} mobileAnimation="fade">
                <Link
                  href="/testimonials"
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                  data-cursor="button"
                  data-cursor-text="View Testimonials"
                >
                  Read More Testimonials
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </section>

          {/* Contact CTA Section */}
          <section id="contact-cta">
            <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
              <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
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
                      href="/contact#schedule"
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Schedule"
                    >
                      Schedule a Consultation
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

// Agency Name Animation Component
function AgencyNameAnimation() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Faster animation on mobile
  const charDelay = isMobile ? 0.05 : 0.1
  const sparkleDelay = isMobile ? 1.5 : 2

  return (
    <div className="relative">
      <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#E9E7E2] relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01 }}
          className="inline-block"
        >
          Z
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 1, duration: 0.01 }}
          className="inline-block"
        >
          o
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 2, duration: 0.01 }}
          className="inline-block"
        >
          o
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 3, duration: 0.01 }}
          className="inline-block"
        >
          l
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 4, duration: 0.01 }}
          className="inline-block"
        >
          y
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 5, duration: 0.01 }}
          className="inline-block"
        >
          u
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: charDelay * 6, duration: 0.01 }}
          className="inline-block"
        >
          m
        </motion.span>
      </motion.h1>

      {/* Golden sparkle effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0], x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
        transition={{
          delay: sparkleDelay,
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-[#FF5001]/0 via-[#FF5001]/30 to-[#FF5001]/0 blur-xl"></div>
        </div>
      </motion.div>

      {/* Cursor */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: sparkleDelay, duration: 0.3 }}
        className="absolute bottom-0 right-0 w-1 h-12 md:h-16 bg-[#FF5001] translate-x-2"
      ></motion.div>
    </div>
  )
}

// Portfolio Item Component
function PortfolioItem({ title, category, image }) {
  return (
    <div className="group relative overflow-hidden rounded-xl">
      <div className="aspect-[4/3] bg-[#212121] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
        <span className="text-[#FF5001] text-xs md:text-sm">{category}</span>
        <h3 className="text-lg md:text-xl font-bold mt-1 md:mt-2">{title}</h3>
        <Link
          href="/portfolio"
          className="mt-3 md:mt-4 inline-flex items-center text-[#E9E7E2] hover:text-[#FF5001] transition-colors text-sm md:text-base"
        >
          View Project
          <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>
    </div>
  )
}
