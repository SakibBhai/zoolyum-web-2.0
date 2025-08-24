'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { ConsultationBookingModal } from "@/components/consultation-booking-modal"

// Form validation schema with enhanced phone validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  countryCode: z.string().default("+880"),
  phone: z.string().optional().refine((phone) => {
    if (!phone) return true;
    // Bangladesh phone number validation (11 digits starting with 01)
    const phoneDigits = phone.replace(/\D/g, '');
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    return bdPhoneRegex.test(phoneDigits);
  }, "Please enter a valid Bangladesh phone number (11 digits starting with 013-019)"),
  businessName: z.string().optional(),
  businessWebsite: z.string().optional().refine((url) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid website URL"),
  services: z.array(z.string()).optional(),
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

// Country codes for phone numbers
const countryCodes = [
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
]

// Service options
const serviceOptions = [
  "SEO",
  "Google Ads Management & Scaling",
  "Facebook Ads Management & Scaling",
  "Performance Marketing - Lead Generation",
  "Performance Marketing - D2C Brands"
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [consultationType, setConsultationType] = useState<'brand_strategy' | 'digital_strategy' | 'creative_direction'>('brand_strategy')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      services: []
    }
  })

  // Contact settings functionality removed - endpoint deleted

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
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                      {/* Contact Information Table */}
                      <div className="bg-[#1F1F1F] rounded-lg p-4 sm:p-6 border border-[#333333]">
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-[#FF5001]">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <Label htmlFor="name" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                              Name *
                            </Label>
                            <Input
                              {...register('name', { required: "Name is required" })}
                              type="text"
                              id="name"
                              name="name"
                              required
                              className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                              placeholder="Your full name"
                            />
                            {errors.name && (
                              <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="email" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                              Email *
                            </Label>
                            <Input
                              {...register('email', { required: "Email is required" })}
                              type="email"
                              id="email"
                              name="email"
                              required
                              className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                              placeholder="your.email@example.com"
                            />
                            {errors.email && (
                              <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
                            )}
                          </div>
                        </div>
                      
                        
                        
                        {/* Phone Field with Country Code - Bangladesh Focus */}
                        {(!contactSettings || contactSettings.enablePhoneField) && (
                          <div className="md:col-span-2">
                            <Label htmlFor="phone" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                              Phone Number {contactSettings?.requirePhoneField ? '*' : ''}
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                              <select
                                {...register('countryCode')}
                                name="countryCode"
                                className="px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] min-w-[120px] min-h-[48px] text-base touch-manipulation"
                              >
                                {countryCodes.map((country) => (
                                  <option key={country.code} value={country.code} className="bg-[#252525]">
                                    {country.flag} {country.code}
                                  </option>
                                ))}
                              </select>
                              <Input
                                {...register('phone')}
                                type="tel"
                                id="phone"
                                name="phone"
                                className="flex-1 px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                                placeholder="01812345678 (BD format)"
                               />
                             </div>
                             {errors.phone && (
                               <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                             )}
                             {errors.countryCode && (
                               <p className="text-red-400 text-sm mt-1">{errors.countryCode.message}</p>
                             )}
                          </div>
                        )}
                      </div>
                      
                      {/* Business Information Table */}
                      <div className="bg-[#1F1F1F] rounded-lg p-4 sm:p-6 border border-[#333333]">
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-[#FF5001]">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <Label htmlFor="businessName" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                              Business Name
                            </Label>
                            <Input
                              {...register('businessName')}
                              type="text"
                              id="businessName"
                              name="businessName"
                              className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                              placeholder="Your business name"
                            />
                            {errors.businessName && (
                              <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="businessWebsite" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                              Business Website
                            </Label>
                            <Input
                              {...register('businessWebsite')}
                              type="url"
                              id="businessWebsite"
                              name="businessWebsite"
                              className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                              placeholder="https://yourwebsite.com"
                            />
                            {errors.businessWebsite && (
                              <p className="text-red-400 text-sm mt-1">{errors.businessWebsite.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Services Selection Table */}
                      <div className="bg-[#1F1F1F] rounded-lg p-4 sm:p-6 border border-[#333333]">
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-[#FF5001]">How Can We Help?</h3>
                        <Controller
                          name="services"
                          control={control}
                          render={({ field }) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-3">
                              {serviceOptions.map((service) => (
                                <label key={service} className="flex items-center space-x-3 cursor-pointer group py-2 px-1 rounded-lg hover:bg-[#252525] transition-colors min-h-[48px] touch-manipulation">
                                  <input
                                    type="checkbox"
                                    value={service}
                                    checked={field.value?.includes(service) || false}
                                    onChange={(e) => {
                                      const currentServices = field.value || [];
                                      if (e.target.checked) {
                                        field.onChange([...currentServices, service]);
                                      } else {
                                        field.onChange(currentServices.filter((s) => s !== service));
                                      }
                                    }}
                                    className="w-5 h-5 sm:w-4 sm:h-4 text-[#FF5001] bg-[#252525] border-[#333333] rounded focus:ring-[#FF5001] focus:ring-2 flex-shrink-0"
                                  />
                                  <span className="text-sm sm:text-sm text-[#E9E7E2] group-hover:text-[#FF5001] transition-colors leading-relaxed">
                                    {service}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                         />
                         {errors.services && (
                           <p className="text-red-400 text-sm mt-2">{errors.services.message}</p>
                         )}
                       </div>
                      
                      {/* Message Section */}
                       <div className="bg-[#1F1F1F] rounded-lg p-4 sm:p-6 border border-[#333333]">
                         <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-[#FF5001]">Project Details</h3>
                         <div className="space-y-4 sm:space-y-6">
                           <div>
                             <Label htmlFor="subject" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                               Subject
                             </Label>
                             <Input
                              {...register('subject')}
                              type="text"
                              id="subject"
                              name="subject"
                              className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                              placeholder="Brief description of your project"
                            />
                             {errors.subject && (
                               <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                             )}
                           </div>
                           
                           <div>
                             <Label htmlFor="message" className="block text-sm font-medium mb-3 text-[#E9E7E2]">
                               Message *
                             </Label>
                             <Textarea
                               {...register('message', { required: "Message is required" })}
                               id="message"
                               name="message"
                               required
                               rows={5}
                               className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] resize-none text-base min-h-[120px] touch-manipulation"
                               placeholder="Tell us about your project, goals, timeline, and any specific requirements"
                             />
                             {errors.message && (
                               <p className="text-red-400 text-sm mt-2">{errors.message.message}</p>
                             )}
                           </div>
                         </div>
                       </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 sm:py-3 bg-[#FF5001] text-[#161616] font-bold rounded-lg hover:bg-[#FF5001]/90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] text-base touch-manipulation"
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
