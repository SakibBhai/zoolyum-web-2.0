'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ServicesPageData {
  id?: string
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  hero_image_url: string
  services_eyebrow: string
  services_title: string
  services_description: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultData: ServicesPageData = {
  hero_eyebrow: 'Our Services',
  hero_title: 'Strategic Solutions for Modern Brands',
  hero_description: 'We offer comprehensive services to elevate your brand and drive business growth through strategic thinking and creative excellence.',
  hero_image_url: '/placeholder.svg?height=600&width=1200',
  services_eyebrow: 'What We Do',
  services_title: 'Our Core Services',
  services_description: 'From brand strategy to digital transformation, we provide end-to-end solutions that deliver measurable results.',
  cta_title: 'Ready to Grow Your Business?',
  cta_description: "Let's collaborate to create a tailored strategy that drives real results for your business.",
  cta_primary_text: 'Start Your Project',
  cta_primary_url: '/contact',
  cta_secondary_text: 'View Our Work',
  cta_secondary_url: '/portfolio'
}

export default function ServicesPageAdmin() {
  const router = useRouter()
  const [data, setData] = useState<ServicesPageData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/services-page')
      .then(res => res.json())
      .then(responseData => {
        if (responseData.id) {
          setData(responseData)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching services page:', error)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const url = '/api/admin/services-page'
      const method = data.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save services page configuration')
      }

      const result = await response.json()
      if (result.servicesPage || result.id) {
        setData(prev => ({ ...prev, id: result.servicesPage?.id || result.id }))
      }

      toast.success('Services page configuration saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving services page:', error)
      toast.error('Failed to save services page configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ServicesPageData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5001]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Services Page Configuration</h1>
        <p className="text-muted-foreground">Customize the content displayed on the Services page</p>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and description at the top of the Services page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_eyebrow">Eyebrow Text</Label>
              <Input
                id="hero_eyebrow"
                value={data.hero_eyebrow}
                onChange={(e) => handleChange('hero_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero_title">Main Title</Label>
              <Input
                id="hero_title"
                value={data.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero_description">Description</Label>
              <Textarea
                id="hero_description"
                value={data.hero_description}
                onChange={(e) => handleChange('hero_description', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Hero Image</Label>
              <div className="mt-2">
                <ImageUpload
                  id="services-hero-image"
                  onUploadComplete={(url) => handleChange('hero_image_url', url)}
                  folder="services-page"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
                {data.hero_image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                    <img
                      src={data.hero_image_url}
                      alt="Services preview"
                      className="max-w-xs rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Services Section</CardTitle>
            <CardDescription>Services overview section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="services_eyebrow">Eyebrow Text</Label>
              <Input
                id="services_eyebrow"
                value={data.services_eyebrow}
                onChange={(e) => handleChange('services_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="services_title">Title</Label>
              <Input
                id="services_title"
                value={data.services_title}
                onChange={(e) => handleChange('services_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="services_description">Description</Label>
              <Textarea
                id="services_description"
                value={data.services_description}
                onChange={(e) => handleChange('services_description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
            <CardDescription>Bottom CTA section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cta_title">Title</Label>
              <Input
                id="cta_title"
                value={data.cta_title}
                onChange={(e) => handleChange('cta_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cta_description">Description</Label>
              <Textarea
                id="cta_description"
                value={data.cta_description}
                onChange={(e) => handleChange('cta_description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta_primary_text">Primary Button Text</Label>
                <Input
                  id="cta_primary_text"
                  value={data.cta_primary_text}
                  onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cta_primary_url">Primary Button URL</Label>
                <Input
                  id="cta_primary_url"
                  value={data.cta_primary_url}
                  onChange={(e) => handleChange('cta_primary_url', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta_secondary_text">Secondary Button Text</Label>
                <Input
                  id="cta_secondary_text"
                  value={data.cta_secondary_text}
                  onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cta_secondary_url">Secondary Button URL</Label>
                <Input
                  id="cta_secondary_url"
                  value={data.cta_secondary_url}
                  onChange={(e) => handleChange('cta_secondary_url', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
