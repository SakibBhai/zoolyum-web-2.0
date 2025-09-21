'use client'
import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, Phone, Clock, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ContactForm } from "@/components/contact-form"
import { ConsultationBookingModal } from "@/components/consultation-booking-modal"

interface ContactSettings {
  email?: string
  phone?: string
  address?: string
  workingHours?: string
  twitterUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  behanceUrl?: string
  enablePhoneField: boolean
  requirePhoneField: boolean
}

export default function ContactPage() {
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [consultationType, setConsultationType] = useState<'brand_strategy' | 'digital_strategy' | 'creative_direction'>('brand_strategy')

  // Fetch contact settings on component mount
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await fetch('/api/contacts/settings')
        if (response.ok) {
          const data = await response.json()
          setContactSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch contact settings:', error)
      }
    }

    fetchContactSettings()
  }, [])

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      <Header />

      <main className="pt-24">
        <section className="container mx-auto px-4 py-12">
          <PageHeadline
            eyebrow="Get In Touch"
            title="Let's Create Something Extraordinary Together"
            description="Ready to transform your brand through strategic alchemy? Connect with us to explore how we can elevate your business to new heights."
            titleGradient={true}
          />

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Contact Form */}
            <ScrollReveal animation="fade-slide" direction="left" delay={0.2}>
              <ContactForm />
            </ScrollReveal>

              {/* Contact Information */}
              <div>
                <ScrollReveal animation="fade-slide" direction="right" delay={0.3}>
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <p className="text-[#E9E7E2]/80 mb-8">
                      Feel free to reach out through any of the channels below. We're always excited to discuss new
                      projects and opportunities.
                    </p>
                  </div>
                </ScrollReveal>

                <StaggerReveal className="space-y-8" delay={0.4}>
                  <ContactInfoCard
                    icon={<Mail className="h-6 w-6 text-[#FF5001]" />}
                    title="Email"
                    content={contactSettings?.email || "contact@zoolyum.com"}
                    link={`mailto:${contactSettings?.email || "contact@zoolyum.com"}`}
                  />

                  <ContactInfoCard
                    icon={<Phone className="h-6 w-6 text-[#FF5001]" />}
                    title="Phone"
                    content={contactSettings?.phone || "01601000950"}
                    link={`tel:${(contactSettings?.phone || "01601000950").replace(/\s/g, '')}`}
                  />

                  <ContactInfoCard
                    icon={<MapPin className="h-6 w-6 text-[#FF5001]" />}
                    title="Office"
                    content={contactSettings?.address || "Mirpur 11, Dhaka"}
                  />

                  <ContactInfoCard
                    icon={<Clock className="h-6 w-6 text-[#FF5001]" />}
                    title="Working Hours"
                    content={contactSettings?.workingHours || "Monday - Friday: 9:00 AM - 6:00 PM"}
                  />
                </StaggerReveal>

                <ScrollReveal className="pt-8 border-t border-[#333333] mt-8" delay={0.6}>
                  <h3 className="text-xl font-bold mb-4">Connect on Social Media</h3>
                  <div className="flex space-x-4">
                    <SocialButton 
                      name="X (Twitter)" 
                      url={contactSettings?.twitterUrl || "https://x.com/zoolyum"} 
                      icon="x"
                    />
                    <SocialButton 
                      name="LinkedIn" 
                      url={contactSettings?.linkedinUrl || "https://www.linkedin.com/company/zoolyum"} 
                      icon="linkedin"
                    />
                    <SocialButton 
                      name="Instagram" 
                      url={contactSettings?.instagramUrl || "https://www.instagram.com/zoolyum"} 
                      icon="instagram"
                    />
                    <SocialButton 
                      name="Facebook" 
                      url={contactSettings?.behanceUrl || "https://www.facebook.com/zoolyum"} 
                      icon="facebook"
                    />
                    <SocialButton 
                      name="YouTube" 
                      url={"https://www.youtube.com/@zoolyum"} 
                      icon="youtube"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Schedule a Consultation Section */}
            <section id="schedule" className="mt-16 pt-16 border-t border-[#333333]">
              <ScrollReveal>
                <TextReveal
                  className="text-3xl md:text-4xl font-bold mb-6 text-center"
                  mobileType="words"
                  mobileStaggerDelay={0.02}
                >
                  Schedule a <span className="headline-highlight">Consultation</span>
                </TextReveal>
                <p className="text-[#E9E7E2]/80 text-center max-w-2xl mx-auto mb-12">
                  Book a 30-minute consultation with one of our strategists to discuss your project and explore how we
                  can help transform your brand.
                </p>
              </ScrollReveal>

              <StaggerReveal
                className="grid md:grid-cols-3 gap-6 md:gap-8"
                staggerDelay={0.1}
                mobileStaggerDelay={0.05}
              >
                <Card className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Brand Strategy</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Discuss your brand challenges and explore strategic solutions with our Brand Strategy Director.
                    </p>
                    <button 
                      onClick={() => {
                        setConsultationType('brand_strategy')
                        setIsModalOpen(true)
                      }}
                      className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors"
                    >
                      Book Consultation
                    </button>
                </Card>

                <Card className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Digital Strategy</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Explore digital transformation opportunities with our Digital Director to enhance your online
                      presence.
                    </p>
                    <button 
                      onClick={() => {
                        setConsultationType('digital_strategy')
                        setIsModalOpen(true)
                      }}
                      className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors"
                    >
                      Book Consultation
                    </button>
                </Card>

                <Card className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Creative Direction</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Discuss your creative vision with our Creative Director and explore visual storytelling
                      opportunities.
                    </p>
                    <button 
                      onClick={() => {
                        setConsultationType('creative_direction')
                        setIsModalOpen(true)
                      }}
                      className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors"
                    >
                      Book Consultation
                    </button>
                </Card>
              </StaggerReveal>
            </section>

            {/* Map Section */}
            <ScrollReveal className="mt-16 pt-16 border-t border-[#333333]" delay={0.2}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Find Us</h2>
                <p className="text-[#E9E7E2]/80">Visit our office in the heart of the Design District</p>
              </div>
              <div className="h-[400px] bg-[#1A1A1A] rounded-2xl overflow-hidden">
                {/* Replace with actual map component if needed */}
                <div className="w-full h-full flex items-center justify-center bg-[#252525]">
                  <p className="text-[#E9E7E2]/50">Interactive Map Placeholder</p>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
        
        <ConsultationBookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          consultationType={consultationType}
        />
      </div>
  )
}

interface ContactInfoCardProps {
  icon: React.ReactNode
  title: string
  content: string
  link?: string
}

function ContactInfoCard({ icon, title, content, link }: ContactInfoCardProps) {
  const ContentElement = link ? (
    <a href={link} className="text-[#E9E7E2] hover:text-[#FF5001] transition-colors">
      {content}
    </a>
  ) : (
    <p className="text-[#E9E7E2]">{content}</p>
  )

  return (
    <Card className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
        <div className="flex items-start">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="font-bold mb-1">{title}</h3>
            {ContentElement}
          </div>
        </div>
    </Card>
  )
}

function SocialButton({ name, url, icon }: { name: string; url?: string; icon: string }) {
  const getSocialIcon = (iconType: string) => {
    switch (iconType) {
      case 'facebook':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'youtube':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      case 'instagram':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'x':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
          </svg>
        )
    }
  }

  return (
    <a
      href={url || `https://${name}.com`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors duration-300"
      data-cursor="link"
      data-cursor-text={name}
    >
      <span className="sr-only">{name}</span>
      {getSocialIcon(icon)}
    </a>
  )
}
