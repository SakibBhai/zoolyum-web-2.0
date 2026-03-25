'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save, Loader2, Eye, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Value {
  number: string
  title: string
  description: string
}

interface AboutPageData {
  id?: string
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  hero_image_url: string
  story_title: string
  story_paragraph_1: string
  story_paragraph_2: string
  story_paragraph_3: string
  story_image_url: string
  mission_title: string
  mission_content: string
  values: Value[]
  team_eyebrow: string
  team_title: string
  team_description: string
  cta_eyebrow: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultData: AboutPageData = {
  hero_eyebrow: 'About Us',
  hero_title: 'Strategic Brand Alchemy for Modern Businesses',
  hero_description: 'Zoolyum is a full-service brand strategy agency dedicated to transforming businesses into powerful market forces through strategic thinking and creative excellence.',
  hero_image_url: '/placeholder.svg?height=600&width=1200',
  story_title: 'From Vision to Reality',
  story_paragraph_1: 'Founded in 2013 by Sakib Chowdhury, Zoolyum began with a simple yet powerful vision: to help brands unlock their full potential through strategic thinking and creative excellence.',
  story_paragraph_2: 'What started as a one-person consultancy has grown into a diverse team of strategists, designers, and digital experts united by a passion for transforming brands. Over the years, we\'ve evolved our approach and expanded our capabilities, but our core mission remains unchanged.',
  story_paragraph_3: 'Today, Zoolyum works with ambitious businesses across industries, from emerging startups to established enterprises, helping them navigate complex market challenges and seize new opportunities for growth.',
  story_image_url: '/placeholder.svg?height=600&width=500',
  mission_title: 'Our Mission',
  mission_content: 'To transform brands through strategic thinking and creative excellence, creating meaningful connections between businesses and their audiences that drive sustainable growth.',
  values: [
    {
      number: '01',
      title: 'Strategic Excellence',
      description: 'We believe in the power of strategic thinking to solve complex brand challenges and create meaningful impact.'
    },
    {
      number: '02',
      title: 'Creative Courage',
      description: 'We embrace bold ideas and innovative approaches that help brands stand out in crowded markets.'
    },
    {
      number: '03',
      title: 'Collaborative Partnership',
      description: 'We work as an extension of our clients\' teams, fostering open communication and shared success.'
    },
    {
      number: '04',
      title: 'Measurable Impact',
      description: 'We focus on creating work that delivers tangible results and drives business growth.'
    }
  ],
  team_eyebrow: 'Our Team',
  team_title: 'Meet the Strategists & Creatives',
  team_description: 'Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.',
  cta_eyebrow: 'Work With Us',
  cta_title: 'Ready to Transform Your Brand?',
  cta_description: 'Let\'s collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.',
  cta_primary_text: 'Start Your Project',
  cta_primary_url: '/contact',
  cta_secondary_text: 'Explore Our Services',
  cta_secondary_url: '/services'
}

export default function AboutPageAdmin() {
  const router = useRouter()
  const [data, setData] = useState<AboutPageData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch current about page data
  useEffect(() => {
    fetch('/api/admin/about-page')
      .then(res => res.json())
      .then(responseData => {
        if (responseData.id) {
          setData(responseData)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching about page:', error)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const url = '/api/admin/about-page'
      const method = data.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save about page')
      }

      const result = await response.json()
      setData(prev => ({ ...prev, id: result.aboutPage.id }))
      toast.success('About page saved successfully!')
    } catch (error) {
      console.error('Error saving about page:', error)
      toast.error('Failed to save about page')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageUpload = (url: string) => {
    setData(prev => ({ ...prev, hero_image_url: url }))
  }

  const handleStoryImageUpload = (url: string) => {
    setData(prev => ({ ...prev, story_image_url: url }))
  }

  const handleAddValue = () => {
    const newNumber = String(data.values.length + 1).padStart(2, '0')
    setData(prev => ({
      ...prev,
      values: [
        ...prev.values,
        { number: newNumber, title: '', description: '' }
      ]
    }))
  }

  const handleRemoveValue = (index: number) => {
    setData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  const handleValueChange = (index: number, field: keyof Value, value: string) => {
    setData(prev => ({
      ...prev,
      values: prev.values.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5001]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">About Page Settings</h1>
            <p className="text-[#E9E7E2]/70 mt-1">Manage your About page content</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/about')}
              className="border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#FF5001] text-[#161616] hover:bg-[#FF5001]/90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Hero Section</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Main hero section at the top of the About page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero_eyebrow">Eyebrow Text</Label>
                <Input
                  id="hero_eyebrow"
                  value={data.hero_eyebrow}
                  onChange={(e) => setData(prev => ({ ...prev, hero_eyebrow: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="hero_title">Title</Label>
                <Input
                  id="hero_title"
                  value={data.hero_title}
                  onChange={(e) => setData(prev => ({ ...prev, hero_title: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="hero_description">Description</Label>
                <Textarea
                  id="hero_description"
                  value={data.hero_description}
                  onChange={(e) => setData(prev => ({ ...prev, hero_description: e.target.value }))}
                  rows={3}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label>Hero Image</Label>
                <div className="mt-2">
                  {data.hero_image_url && (
                    <img
                      src={data.hero_image_url}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <ImageUpload
                    onUploadComplete={handleHeroImageUpload}
                    folder="about-hero"
                    maxSize={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Our Story Section</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Company story and history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="story_title">Title</Label>
                <Input
                  id="story_title"
                  value={data.story_title}
                  onChange={(e) => setData(prev => ({ ...prev, story_title: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="story_paragraph_1">Paragraph 1</Label>
                <Textarea
                  id="story_paragraph_1"
                  value={data.story_paragraph_1}
                  onChange={(e) => setData(prev => ({ ...prev, story_paragraph_1: e.target.value }))}
                  rows={3}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="story_paragraph_2">Paragraph 2</Label>
                <Textarea
                  id="story_paragraph_2"
                  value={data.story_paragraph_2}
                  onChange={(e) => setData(prev => ({ ...prev, story_paragraph_2: e.target.value }))}
                  rows={3}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="story_paragraph_3">Paragraph 3</Label>
                <Textarea
                  id="story_paragraph_3"
                  value={data.story_paragraph_3}
                  onChange={(e) => setData(prev => ({ ...prev, story_paragraph_3: e.target.value }))}
                  rows={3}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label>Story Image</Label>
                <div className="mt-2">
                  {data.story_image_url && (
                    <img
                      src={data.story_image_url}
                      alt="Story"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <ImageUpload
                    onUploadComplete={handleStoryImageUpload}
                    folder="about-story"
                    maxSize={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Mission Section</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Company mission and values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mission_title">Mission Title</Label>
                <Input
                  id="mission_title"
                  value={data.mission_title}
                  onChange={(e) => setData(prev => ({ ...prev, mission_title: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="mission_content">Mission Content</Label>
                <Textarea
                  id="mission_content"
                  value={data.mission_content}
                  onChange={(e) => setData(prev => ({ ...prev, mission_content: e.target.value }))}
                  rows={5}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#E9E7E2]">Core Values</CardTitle>
                  <CardDescription className="text-[#E9E7E2]/70">
                    Company values and principles
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddValue}
                  variant="outline"
                  className="border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.values.map((value, index) => (
                <div key={index} className="p-4 bg-[#0A0A0A] rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Value {index + 1}</h4>
                    <Button
                      onClick={() => handleRemoveValue(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Number</Label>
                    <Input
                      value={value.number}
                      onChange={(e) => handleValueChange(index, 'number', e.target.value)}
                      className="bg-[#161616] border-[#333333] text-[#E9E7E2]"
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                      className="bg-[#161616] border-[#333333] text-[#E9E7E2]"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      rows={2}
                      className="bg-[#161616] border-[#333333] text-[#E9E7E2]"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Team Section</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Team section header
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="team_eyebrow">Eyebrow Text</Label>
                <Input
                  id="team_eyebrow"
                  value={data.team_eyebrow}
                  onChange={(e) => setData(prev => ({ ...prev, team_eyebrow: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="team_title">Title</Label>
                <Input
                  id="team_title"
                  value={data.team_title}
                  onChange={(e) => setData(prev => ({ ...prev, team_title: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="team_description">Description</Label>
                <Textarea
                  id="team_description"
                  value={data.team_description}
                  onChange={(e) => setData(prev => ({ ...prev, team_description: e.target.value }))}
                  rows={2}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Call-to-Action Section</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Bottom CTA section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cta_eyebrow">Eyebrow Text</Label>
                <Input
                  id="cta_eyebrow"
                  value={data.cta_eyebrow}
                  onChange={(e) => setData(prev => ({ ...prev, cta_eyebrow: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="cta_title">Title</Label>
                <Input
                  id="cta_title"
                  value={data.cta_title}
                  onChange={(e) => setData(prev => ({ ...prev, cta_title: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label htmlFor="cta_description">Description</Label>
                <Textarea
                  id="cta_description"
                  value={data.cta_description}
                  onChange={(e) => setData(prev => ({ ...prev, cta_description: e.target.value }))}
                  rows={2}
                  className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta_primary_text">Primary Button Text</Label>
                  <Input
                    id="cta_primary_text"
                    value={data.cta_primary_text}
                    onChange={(e) => setData(prev => ({ ...prev, cta_primary_text: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                  />
                </div>

                <div>
                  <Label htmlFor="cta_primary_url">Primary Button URL</Label>
                  <Input
                    id="cta_primary_url"
                    value={data.cta_primary_url}
                    onChange={(e) => setData(prev => ({ ...prev, cta_primary_url: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                  />
                </div>

                <div>
                  <Label htmlFor="cta_secondary_text">Secondary Button Text</Label>
                  <Input
                    id="cta_secondary_text"
                    value={data.cta_secondary_text}
                    onChange={(e) => setData(prev => ({ ...prev, cta_secondary_text: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                  />
                </div>

                <div>
                  <Label htmlFor="cta_secondary_url">Secondary Button URL</Label>
                  <Input
                    id="cta_secondary_url"
                    value={data.cta_secondary_url}
                    onChange={(e) => setData(prev => ({ ...prev, cta_secondary_url: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-[#E9E7E2]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
