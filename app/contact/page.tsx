"use client"

import type React from "react"

import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, Phone, Clock, Send, Calendar } from "lucide-react"
import { Card3D } from "@/components/card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"

export default function ContactPage() {
  return (
    <PageTransition>
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
                <Card3D depth={10} glareIntensity={0.1}>
                  <div className="bg-[#1A1A1A] p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                            placeholder="Your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                          placeholder="Subject of your message"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                          placeholder="Tell us about your project"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 flex items-center justify-center"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </button>
                    </form>
                  </div>
                </Card3D>
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
                    content="hello@zoolyum.com"
                    link="mailto:hello@zoolyum.com"
                  />

                  <ContactInfoCard
                    icon={<Phone className="h-6 w-6 text-[#FF5001]" />}
                    title="Phone"
                    content="+1 (555) 123-4567"
                    link="tel:+15551234567"
                  />

                  <ContactInfoCard
                    icon={<MapPin className="h-6 w-6 text-[#FF5001]" />}
                    title="Office"
                    content="123 Creative Street, Design District, San Francisco, CA 94103"
                  />

                  <ContactInfoCard
                    icon={<Clock className="h-6 w-6 text-[#FF5001]" />}
                    title="Working Hours"
                    content="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </StaggerReveal>

                <ScrollReveal className="pt-8 border-t border-[#333333] mt-8" delay={0.6}>
                  <h3 className="text-xl font-bold mb-4">Connect on Social Media</h3>
                  <div className="flex space-x-4">
                    <SocialButton name="twitter" />
                    <SocialButton name="linkedin" />
                    <SocialButton name="instagram" />
                    <SocialButton name="behance" />
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
                <Card3D depth={10} glareIntensity={0.1}>
                  <div className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Brand Strategy</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Discuss your brand challenges and explore strategic solutions with our Brand Strategy Director.
                    </p>
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
                      Book Consultation
                    </button>
                  </div>
                </Card3D>

                <Card3D depth={10} glareIntensity={0.1}>
                  <div className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Digital Strategy</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Explore digital transformation opportunities with our Digital Director to enhance your online
                      presence.
                    </p>
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
                      Book Consultation
                    </button>
                  </div>
                </Card3D>

                <Card3D depth={10} glareIntensity={0.1}>
                  <div className="bg-[#1A1A1A] p-6 rounded-xl h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-[#FF5001] mr-3" />
                      <h3 className="font-bold">Creative Direction</h3>
                    </div>
                    <p className="text-[#E9E7E2]/80 mb-6 flex-grow">
                      Discuss your creative vision with our Creative Director and explore visual storytelling
                      opportunities.
                    </p>
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
                      Book Consultation
                    </button>
                  </div>
                </Card3D>
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
      </div>
    </PageTransition>
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
    <Card3D depth={5} glareIntensity={0.05}>
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
        <div className="flex items-start">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="font-bold mb-1">{title}</h3>
            {ContentElement}
          </div>
        </div>
      </div>
    </Card3D>
  )
}

function SocialButton({ name }: { name: string }) {
  return (
    <a
      href={`https://${name}.com`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors duration-300"
      data-cursor="link"
      data-cursor-text={name}
    >
      <span className="sr-only">{name}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}
