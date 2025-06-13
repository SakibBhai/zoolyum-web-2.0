"use client"

'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, Phone, Clock, Send, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters")
})

type ContactFormData = z.infer<typeof contactFormSchema>

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  })

  // Fetch contact settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/contacts/settings')
        if (response.ok) {
          const settings = await response.json()
          setContactSettings(settings)
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error)
      }
    }
    
    fetchSettings()
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Thank you for your message! We\'ll get back to you soon.')
        reset()
      } else {
        const errorData = await response.json()
        setSubmitStatus('error')
        setSubmitMessage(errorData.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <Card className="bg-[#1A1A1A] p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                    
                    {/* Submit Status Alert */}
                    {submitStatus !== 'idle' && (
                      <Alert className={`mb-6 ${submitStatus === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                        {submitStatus === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <AlertDescription className={submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}>
                          {submitMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name *
                          </Label>
                          <Input
                            {...register('name')}
                            type="text"
                            id="name"
                            className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                            placeholder="Your name"
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                          </Label>
                          <Input
                            {...register('email')}
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                            placeholder="Your email"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Phone Field - conditionally rendered based on settings */}
                        {(!contactSettings || contactSettings.enablePhoneField) && (
                          <div>
                            <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                              Phone {contactSettings?.requirePhoneField ? '*' : ''}
                            </Label>
                            <Input
                              {...register('phone')}
                              type="tel"
                              id="phone"
                              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                              placeholder="Your phone number"
                            />
                            {errors.phone && (
                              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Subject
                          </Label>
                          <Input
                            {...register('subject')}
                            type="text"
                            id="subject"
                            className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                            placeholder="Subject of your message"
                          />
                          {errors.subject && (
                            <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </Label>
                        <Textarea
                          {...register('message')}
                          id="message"
                          rows={5}
                          className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] resize-none"
                          placeholder="Tell us about your project"
                        />
                        {errors.message && (
                          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#161616] mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                </Card>
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
                    content={contactSettings?.email || "hello@zoolyum.com"}
                    link={`mailto:${contactSettings?.email || "hello@zoolyum.com"}`}
                  />

                  <ContactInfoCard
                    icon={<Phone className="h-6 w-6 text-[#FF5001]" />}
                    title="Phone"
                    content={contactSettings?.phone || "+1 (555) 123-4567"}
                    link={`tel:${(contactSettings?.phone || "+1 (555) 123-4567").replace(/\s/g, '')}`}
                  />

                  <ContactInfoCard
                    icon={<MapPin className="h-6 w-6 text-[#FF5001]" />}
                    title="Office"
                    content={contactSettings?.address || "123 Creative Street, Design District, San Francisco, CA 94103"}
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
                      name="twitter" 
                      url={contactSettings?.twitterUrl || "https://twitter.com"} 
                    />
                    <SocialButton 
                      name="linkedin" 
                      url={contactSettings?.linkedinUrl || "https://linkedin.com"} 
                    />
                    <SocialButton 
                      name="instagram" 
                      url={contactSettings?.instagramUrl || "https://instagram.com"} 
                    />
                    <SocialButton 
                      name="behance" 
                      url={contactSettings?.behanceUrl || "https://behance.com"} 
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
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
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
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
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
                    <button className="w-full px-4 py-3 bg-[#252525] hover:bg-[#333333] text-[#E9E7E2] font-medium rounded-lg transition-colors">
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

function SocialButton({ name, url }: { name: string; url?: string }) {
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}
