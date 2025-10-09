'use client'

import type React from "react"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConsultationBookingModal } from "@/components/consultation-booking-modal"

// Form validation schema with enhanced phone validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().optional().refine((email) => {
    if (!email) return true;
    return z.string().email().safeParse(email).success;
  }, "Please enter a valid email address"),
  countryCode: z.string().default("+880"),
  phone: z.string().min(1, "Phone number is required").refine((phone) => {
    if (!phone) return false;
    // Bangladesh phone number validation (11 digits starting with 01)
    const phoneDigits = phone.replace(/\D/g, '');
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    return bdPhoneRegex.test(phoneDigits);
  }, "Please enter a valid Bangladesh phone number (11 digits starting with 013-019)"),
  businessName: z.string().optional(),
  businessWebsite: z.string().optional().refine((url) => {
    if (!url) return true;
    // Allow social media links and website URLs
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid website URL or social media link"),
  services: z.array(z.string()).optional()
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

export function ContactForm() {
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
    <>
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
                  Email
                </Label>
                <Input
                  {...register('email')}
                  type="email"
                  id="email"
                  name="email"
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
                  Phone Number *
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
                  Website or Social Media Link
                </Label>
                <Input
                  {...register('businessWebsite')}
                  type="url"
                  id="businessWebsite"
                  name="businessWebsite"
                  className="w-full px-4 py-4 sm:py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] text-base min-h-[48px] touch-manipulation"
                  placeholder="https://yourwebsite.com or social media link"
                />
                {errors.businessWebsite && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessWebsite.message}</p>
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
      
      <ConsultationBookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        consultationType={consultationType}
      />
    </>
  )
}