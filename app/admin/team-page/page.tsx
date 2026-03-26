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

interface TeamPageData {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  hero_image_url: string
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
  culture_image_url: string
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
  hero_image_url: '/placeholder.svg?height=600&width=1200',
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
  culture_image_url: '/placeholder.svg?height=600&width=500',
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
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/team-page')
      .then(res => res.json())
      .then(teamPageData => {
        console.log('Team page data fetched:', teamPageData)
        console.log('Culture image URL:', teamPageData.culture_image_url)
        setData(teamPageData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching team page:', error)
        setLoading(false)
      })
  }, [])

  // Debug: Monitor culture_image_url changes
  useEffect(() => {
    console.log('=== CULTURE IMAGE URL CHANGED ===')
    console.log('Current value:', data.culture_image_url)
    console.log('Is truthy:', !!data.culture_image_url)
    console.log('Type:', typeof data.culture_image_url)
  }, [data.culture_image_url])

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

      const result = await response.json()

      // Update local state with the saved data from server
      setData(result)

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
    console.log(`Updating ${field}:`, value)
    console.log('Before update - current culture_image_url:', data.culture_image_url)
    setData(prev => {
      const newData = { ...prev, [field]: value }
      console.log('After update - new culture_image_url:', newData.culture_image_url)
      return newData
    })
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
            <div>
              <Label>Hero Image</Label>
              <div className="mt-2">
                <ImageUpload
                  id="hero-image-upload"
                  onUploadComplete={(url) => handleChange('hero_image_url', url)}
                  folder="team-page"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
                {data.hero_image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                    <img
                      src={data.hero_image_url}
                      alt="Hero preview"
                      className="max-w-xs rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
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
            <div>
              <Label>Culture Image</Label>
              <div className="mt-2">
                {/* Debug Section */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs font-mono font-semibold mb-1">DEBUG INFO:</p>
                  <p className="text-xs font-mono">culture_image_url value: <span className="font-bold">{data.culture_image_url || 'NOT SET'}</span></p>
                  <p className="text-xs font-mono">Is truthy: {String(!!data.culture_image_url)}</p>
                </div>

                {/* Manual URL Input for Testing */}
                <div className="mb-4">
                  <Label htmlFor="manual_culture_url" className="text-xs">Or paste image URL directly:</Label>
                  <Input
                    id="manual_culture_url"
                    value={data.culture_image_url || ''}
                    onChange={(e) => handleChange('culture_image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                <ImageUpload
                  id="culture-image-upload"
                  onUploadComplete={(url) => {
                    console.log('=== CULTURE IMAGE UPLOAD CALLBACK ===')
                    console.log('Upload complete, URL:', url)
                    console.log('URL type:', typeof url)
                    console.log('URL length:', url?.length)
                    setUploadError(null) // Clear any previous errors
                    if (!url || typeof url !== 'string' || url.length === 0) {
                      console.error('INVALID URL RECEIVED:', url)
                      setUploadError('Invalid URL received from upload')
                      return
                    }
                    handleChange('culture_image_url', url)
                  }}
                  onError={(error) => {
                    console.error('=== IMAGE UPLOAD ERROR ===')
                    console.error('Error:', error)
                    setUploadError(error)
                    // Clear error after 5 seconds
                    setTimeout(() => setUploadError(null), 5000)
                  }}
                  folder="team-page"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />

                {/* Error Display */}
                {uploadError && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">Upload Error:</p>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">{uploadError}</p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">Please check if you're logged in or try again.</p>
                  </div>
                )}
                {data.culture_image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                    <img
                      src={data.culture_image_url}
                      alt="Culture preview"
                      className="max-w-xs rounded-lg border border-border"
                      onError={(e) => {
                        console.error('Image failed to load:', data.culture_image_url)
                        e.currentTarget.src = '/placeholder.svg?height=600&width=500'
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-2 break-all">URL: {data.culture_image_url}</p>
                  </div>
                )}
              </div>
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
