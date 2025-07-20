'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ConsultationBookingModalProps {
  isOpen: boolean
  onClose: () => void
  consultationType: 'brand_strategy' | 'digital_strategy' | 'creative_direction'
}

interface FormData {
  fullName: string
  email: string
  companyName: string
  websiteUrl: string
  role: string
  mainChallenge: string
  otherChallenge: string
  sessionGoal: string
  preferredDate: Date | undefined
  preferredTime: string
  additionalNotes: string
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  companyName: '',
  websiteUrl: '',
  role: '',
  mainChallenge: '',
  otherChallenge: '',
  sessionGoal: '',
  preferredDate: undefined,
  preferredTime: '',
  additionalNotes: ''
}

const roleOptions = [
  'Founder/CEO',
  'Marketing Director',
  'Brand Manager',
  'Creative Director',
  'Product Manager',
  'Business Owner',
  'Startup Founder',
  'Other'
]

const challengeOptions = [
  { value: 'lack_of_brand_clarity', label: 'Lack of brand clarity' },
  { value: 'inconsistent_messaging', label: 'Inconsistent messaging' },
  { value: 'poor_customer_perception', label: 'Poor customer perception' },
  { value: 'launching_new_brand', label: 'Launching a new brand' },
  { value: 'digital_transformation', label: 'Digital transformation needs' },
  { value: 'competitive_positioning', label: 'Competitive positioning' },
  { value: 'other', label: 'Other (please specify)' }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export function ConsultationBookingModal({ isOpen, onClose, consultationType }: ConsultationBookingModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const consultationTitles = {
    brand_strategy: 'Brand Strategy Consultation',
    digital_strategy: 'Digital Strategy Consultation',
    creative_direction: 'Creative Direction Consultation'
  }

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.mainChallenge) {
      newErrors.mainChallenge = 'Please select your main challenge'
    }

    if (formData.mainChallenge === 'other' && !formData.otherChallenge.trim()) {
      newErrors.otherChallenge = 'Please describe your challenge'
    }

    if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time for preferredDatetime
      let preferredDatetime: string | undefined
      if (formData.preferredDate && formData.preferredTime) {
        const [hours, minutes] = formData.preferredTime.split(':')
        const datetime = new Date(formData.preferredDate)
        datetime.setHours(parseInt(hours), parseInt(minutes))
        preferredDatetime = datetime.toISOString()
      }

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          role: formData.role || undefined,
          mainChallenge: formData.mainChallenge,
          otherChallenge: formData.otherChallenge || undefined,
          sessionGoal: formData.sessionGoal || undefined,
          preferredDatetime,
          additionalNotes: formData.additionalNotes || undefined,
          consultationType
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit consultation booking')
      }

      const result = await response.json()
      
      toast.success('Consultation booked successfully!', {
        description: 'We\'ll contact you within 24 hours to confirm your session.'
      })
      
      // Reset form and close modal
      setFormData(initialFormData)
      onClose()
    } catch (error) {
      console.error('Error submitting consultation:', error)
      toast.error('Failed to book consultation', {
        description: error instanceof Error ? error.message : 'Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#E9E7E2]">
            {consultationTitles[consultationType]}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#E9E7E2]">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Who should we address?"
              className={cn(
                "bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                errors.fullName && "border-red-500"
              )}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#E9E7E2]">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="For sending confirmation & calendar invite"
              className={cn(
                "bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-[#E9E7E2]">
              Company Name / Brand
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Tell us about your business"
              className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
            />
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="text-[#E9E7E2]">
              Website / Social Links
            </Label>
            <Input
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              placeholder="Optional but helps us review your brand presence"
              className={cn(
                "bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                errors.websiteUrl && "border-red-500"
              )}
            />
            {errors.websiteUrl && (
              <p className="text-red-500 text-sm">{errors.websiteUrl}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[#E9E7E2]">
              Your Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]">
                <SelectValue placeholder="Are you the founder, marketing head, etc.?" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Challenge */}
          <div className="space-y-2">
            <Label htmlFor="mainChallenge" className="text-[#E9E7E2]">
              Main Brand Challenge *
            </Label>
            <Select 
              value={formData.mainChallenge} 
              onValueChange={(value) => handleInputChange('mainChallenge', value)}
            >
              <SelectTrigger className={cn(
                "bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                errors.mainChallenge && "border-red-500"
              )}>
                <SelectValue placeholder="What are you currently struggling with?" />
              </SelectTrigger>
              <SelectContent>
                {challengeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mainChallenge && (
              <p className="text-red-500 text-sm">{errors.mainChallenge}</p>
            )}
          </div>

          {/* Other Challenge (conditional) */}
          {formData.mainChallenge === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="otherChallenge" className="text-[#E9E7E2]">
                Please describe your challenge *
              </Label>
              <Textarea
                id="otherChallenge"
                value={formData.otherChallenge}
                onChange={(e) => handleInputChange('otherChallenge', e.target.value)}
                placeholder="Tell us more about your specific challenge..."
                className={cn(
                  "bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                  errors.otherChallenge && "border-red-500"
                )}
                rows={3}
              />
              {errors.otherChallenge && (
                <p className="text-red-500 text-sm">{errors.otherChallenge}</p>
              )}
            </div>
          )}

          {/* Session Goal */}
          <div className="space-y-2">
            <Label htmlFor="sessionGoal" className="text-[#E9E7E2]">
              What do you hope to achieve from this session?
            </Label>
            <Textarea
              id="sessionGoal"
              value={formData.sessionGoal}
              onChange={(e) => handleInputChange('sessionGoal', e.target.value)}
              placeholder="Helps us focus the consultation..."
              className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
              rows={3}
            />
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#E9E7E2]">Preferred Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]",
                      !formData.preferredDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.preferredDate ? (
                      format(formData.preferredDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.preferredDate}
                    onSelect={(date) => handleInputChange('preferredDate', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[#E9E7E2]">Preferred Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-[#E9E7E2]">
              Anything else you'd like to share?
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Optional - any additional context or questions..."
              className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent border-[#333333] text-[#E9E7E2] hover:bg-[#333333]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#E9E7E2] text-[#1A1A1A] hover:bg-[#D4D2CD]"
            >
              {isSubmitting ? 'Booking...' : 'Book Consultation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}