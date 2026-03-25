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

interface TeamPageData {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  leadership_eyebrow: string
  leadership_title: string
  leadership_description: string
  team_eyebrow: string
  team_title: string
  team_description: string
  culture_title: string
  culture_paragraph_1: string
  culture_paragraph_2: string
  culture_paragraph_3: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultData: TeamPageData = {
  hero_eyebrow: 'Our Team',
  hero_title: 'Meet the Strategists & Creatives',
  hero_description: 'Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.',
  leadership_eyebrow: 'Leadership',
  leadership_title: 'Our Leadership Team',
  leadership_description: "Meet the visionaries guiding our agency's strategic direction and creative excellence.",
  team_eyebrow: 'Our Experts',
  team_title: 'The Full Zoolyum Team',
  team_description: 'Our talented team of strategists, designers, and digital experts work collaboratively to deliver exceptional results.',
  culture_title: 'Collaborative Innovation',
  culture_paragraph_1: 'At Zoolyum, we foster a culture of collaborative innovation where diverse perspectives come together to create exceptional work.',
  culture_paragraph_2: "Our team is united by a passion for strategic thinking and creative excellence. We're curious, ambitious, and committed to continuous learning and growth.",
  culture_paragraph_3: "We're always looking for talented individuals who share our values and passion for transforming brands.",
  cta_title: 'Ready to Transform Your Brand?',
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
  cta_primary_text: 'Start Your Project',
  cta_primary_url: '/contact',
  cta_secondary_text: 'View Our Portfolio',
  cta_secondary_url: '/portfolio'
}

export default function TeamPageAdmin() {
  const router = useRouter()
  const [data, setData] = useState<TeamPageData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/team-page')
      .then(res => res.json())
      .then(teamPageData => {
        setData(teamPageData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching team page:', error)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/admin/team-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save team page configuration')
      }

      toast.success('Team page configuration saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving team page:', error)
      toast.error('Failed to save team page configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof TeamPageData, value: string) => {
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
        <h1 className="text-3xl font-bold">Team Page Configuration</h1>
        <p className="text-muted-foreground">Customize the content displayed on the Team page</p>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and description at the top of the Team page</CardDescription>
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

        {/* Leadership Section */}
        <Card>
          <CardHeader>
            <CardTitle>Leadership Section</CardTitle>
            <CardDescription>Featured leadership team section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="leadership_eyebrow">Eyebrow Text</Label>
              <Input
                id="leadership_eyebrow"
                value={data.leadership_eyebrow}
                onChange={(e) => handleChange('leadership_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="leadership_title">Title</Label>
              <Input
                id="leadership_title"
                value={data.leadership_title}
                onChange={(e) => handleChange('leadership_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="leadership_description">Description</Label>
              <Textarea
                id="leadership_description"
                value={data.leadership_description}
                onChange={(e) => handleChange('leadership_description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle>Team Section</CardTitle>
            <CardDescription>Full team listing section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="team_eyebrow">Eyebrow Text</Label>
              <Input
                id="team_eyebrow"
                value={data.team_eyebrow}
                onChange={(e) => handleChange('team_eyebrow', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="team_title">Title</Label>
              <Input
                id="team_title"
                value={data.team_title}
                onChange={(e) => handleChange('team_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="team_description">Description</Label>
              <Textarea
                id="team_description"
                value={data.team_description}
                onChange={(e) => handleChange('team_description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Culture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Culture Section</CardTitle>
            <CardDescription>Company culture information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="culture_title">Title</Label>
              <Input
                id="culture_title"
                value={data.culture_title}
                onChange={(e) => handleChange('culture_title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="culture_paragraph_1">Paragraph 1</Label>
              <Textarea
                id="culture_paragraph_1"
                value={data.culture_paragraph_1}
                onChange={(e) => handleChange('culture_paragraph_1', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="culture_paragraph_2">Paragraph 2</Label>
              <Textarea
                id="culture_paragraph_2"
                value={data.culture_paragraph_2}
                onChange={(e) => handleChange('culture_paragraph_2', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="culture_paragraph_3">Paragraph 3</Label>
              <Textarea
                id="culture_paragraph_3"
                value={data.culture_paragraph_3}
                onChange={(e) => handleChange('culture_paragraph_3', e.target.value)}
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
