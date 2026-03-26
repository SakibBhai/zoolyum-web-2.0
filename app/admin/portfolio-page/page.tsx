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

interface PortfolioPageData {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  featured_eyebrow: string
  featured_title: string
  featured_description: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultData: PortfolioPageData = {
  hero_eyebrow: 'Our Portfolio',
  hero_title: 'Strategic Brand Transformations',
  hero_description: 'Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence.',
  featured_eyebrow: 'Featured Project',
  featured_title: 'Featured Work',
  featured_description: 'Highlighting our most impactful work that showcases our expertise and creativity.',
  cta_title: 'Ready to Transform Your Brand?',
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
  cta_primary_text: 'Start Your Project',
  cta_primary_url: '/contact',
  cta_secondary_text: 'Explore Our Services',
  cta_secondary_url: '/services'
}

export default function PortfolioPageAdmin() {
  const router = useRouter()
  const [data, setData] = useState<PortfolioPageData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/portfolio-page')
      .then(res => res.json())
      .then(portfolioData => {
        setData(portfolioData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching portfolio page:', error)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/admin/portfolio-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save portfolio page configuration')
      }

      toast.success('Portfolio page configuration saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving portfolio page:', error)
      toast.error('Failed to save portfolio page configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof PortfolioPageData, value: string) => {
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
        <h1 className="text-3xl font-bold">Portfolio Page Configuration</h1>
        <p className="text-muted-foreground">Customize the content displayed on the Portfolio page</p>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and description at the top of the Portfolio page</CardDescription>
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

        {/* Featured Section */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Section</CardTitle>
            <CardDescription>Featured project section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="featured_eyebrow">Eyebrow Text</Label>
              <Input
                id="featured_eyebrow"
                value={data.featured_eyebrow}
                onChange={(e) => handleChange('featured_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="featured_title">Title</Label>
              <Input
                id="featured_title"
                value={data.featured_title}
                onChange={(e) => handleChange('featured_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="featured_description">Description</Label>
              <Textarea
                id="featured_description"
                value={data.featured_description}
                onChange={(e) => handleChange('featured_description', e.target.value)}
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
