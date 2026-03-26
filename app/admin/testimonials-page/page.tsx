'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface TestimonialsPageData {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  stats_eyebrow: string
  stats_title: string
  stats_description: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
}

const defaultData: TestimonialsPageData = {
  hero_eyebrow: 'Client Stories',
  hero_title: 'Transformative Success Stories',
  hero_description: 'Hear from the brands and businesses that have experienced the transformative power of our strategic approach and creative excellence.',
  stats_eyebrow: 'Results',
  stats_title: 'Measurable Business Impact',
  stats_description: 'Our strategic approach delivers tangible results for our clients across various metrics.',
  cta_title: 'Ready to Join Our Success Stories?',
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives results.",
  cta_primary_text: 'Start Your Project',
  cta_primary_url: '/contact'
}

export default function TestimonialsPageAdmin() {
  const router = useRouter()
  const [data, setData] = useState<TestimonialsPageData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/testimonials-page')
      .then(res => res.json())
      .then(testimonialsData => {
        setData(testimonialsData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching testimonials page:', error)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/admin/testimonials-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save testimonials page configuration')
      }

      toast.success('Testimonials page configuration saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving testimonials page:', error)
      toast.error('Failed to save testimonials page configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof TestimonialsPageData, value: string) => {
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
        <h1 className="text-3xl font-bold">Testimonials Page Configuration</h1>
        <p className="text-muted-foreground">Customize the content displayed on the Testimonials page</p>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and description at the top of the Testimonials page</CardDescription>
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
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Stats Section</CardTitle>
            <CardDescription>Statistics section heading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stats_eyebrow">Eyebrow Text</Label>
              <Input
                id="stats_eyebrow"
                value={data.stats_eyebrow}
                onChange={(e) => handleChange('stats_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stats_title">Title</Label>
              <Input
                id="stats_title"
                value={data.stats_title}
                onChange={(e) => handleChange('stats_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stats_description">Description</Label>
              <Textarea
                id="stats_description"
                value={data.stats_description}
                onChange={(e) => handleChange('stats_description', e.target.value)}
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
                <Label htmlFor="cta_primary_text">Button Text</Label>
                <Input
                  id="cta_primary_text"
                  value={data.cta_primary_text}
                  onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cta_primary_url">Button URL</Label>
                <Input
                  id="cta_primary_url"
                  value={data.cta_primary_url}
                  onChange={(e) => handleChange('cta_primary_url', e.target.value)}
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
