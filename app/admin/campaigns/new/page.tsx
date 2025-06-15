'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RichTextEditor } from '@/components/admin/rich-text-editor'

interface CTA {
  label: string
  url: string
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea'
  required: boolean
  placeholder?: string
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    imageUrls: [''],
    videoUrls: [''],
    enableForm: false,
    successMessage: 'Thank you for your submission!',
    redirectUrl: '',
  })
  
  const [ctas, setCtas] = useState<CTA[]>([{ label: '', url: '' }])
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleArrayChange = (field: 'imageUrls' | 'videoUrls', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: 'imageUrls' | 'videoUrls') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field: 'imageUrls' | 'videoUrls', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleCTAChange = (index: number, field: 'label' | 'url', value: string) => {
    const newCTAs = [...ctas]
    newCTAs[index][field] = value
    setCtas(newCTAs)
  }

  const addCTA = () => {
    setCtas([...ctas, { label: '', url: '' }])
  }

  const removeCTA = (index: number) => {
    setCtas(ctas.filter((_, i) => i !== index))
  }

  const handleFormFieldChange = (index: number, field: keyof FormField, value: any) => {
    const newFields = [...formFields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFormFields(newFields)
  }

  const addFormField = () => {
    setFormFields([...formFields, { name: '', label: '', type: 'text', required: false }])
  }

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        imageUrls: formData.imageUrls.filter(url => url.trim()),
        videoUrls: formData.videoUrls.filter(url => url.trim()),
        formFields: formData.enableForm ? formFields : null,
        ctas: ctas.filter(cta => cta.label && cta.url),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/campaigns')
      } else {
        throw new Error('Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Create New Campaign</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Design and launch your marketing campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Basic Information</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Essential details about your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-[#E9E7E2]">Campaign Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-[#E9E7E2]">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="shortDescription" className="text-[#E9E7E2]">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                rows={3}
                placeholder="Brief description for meta tags and summaries"
              />
            </div>

            <div>
              <Label className="text-[#E9E7E2]">Campaign Content</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Scheduling */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Scheduling & Status</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Set campaign timeline and publication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status" className="text-[#E9E7E2]">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="text-[#E9E7E2]">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-[#E9E7E2]">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Media Integration</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Add images and videos to your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div>
              <Label className="text-[#E9E7E2]">Image URLs</Label>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={url}
                    onChange={(e) => handleArrayChange('imageUrls', index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                  {formData.imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('imageUrls', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('imageUrls')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            <Separator className="bg-[#333333]" />

            {/* Videos */}
            <div>
              <Label className="text-[#E9E7E2]">YouTube Video URLs</Label>
              {formData.videoUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={url}
                    onChange={(e) => handleArrayChange('videoUrls', index, e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                  {formData.videoUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('videoUrls', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('videoUrls')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call-to-Action */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Call-to-Action Buttons</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Add action buttons to drive user engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ctas.map((cta, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[#333333] rounded-lg">
                <div>
                  <Label className="text-[#E9E7E2]">Button Label</Label>
                  <Input
                    value={cta.label}
                    onChange={(e) => handleCTAChange(index, 'label', e.target.value)}
                    placeholder="Get Started"
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-[#E9E7E2]">Destination URL</Label>
                    <Input
                      value={cta.url}
                      onChange={(e) => handleCTAChange(index, 'url', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                    />
                  </div>
                  {ctas.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCTA(index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCTA}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add CTA Button
            </Button>
          </CardContent>
        </Card>

        {/* Lead Capture Form */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Lead Capture Form</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Configure form to collect user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableForm"
                checked={formData.enableForm}
                onCheckedChange={(checked) => handleInputChange('enableForm', checked)}
              />
              <Label htmlFor="enableForm" className="text-[#E9E7E2]">Enable lead capture form</Label>
            </div>

            {formData.enableForm && (
              <div className="space-y-4 pt-4 border-t border-[#333333]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="successMessage" className="text-[#E9E7E2]">Success Message</Label>
                    <Textarea
                      id="successMessage"
                      value={formData.successMessage}
                      onChange={(e) => handleInputChange('successMessage', e.target.value)}
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="redirectUrl" className="text-[#E9E7E2]">Redirect URL (Optional)</Label>
                    <Input
                      id="redirectUrl"
                      value={formData.redirectUrl}
                      onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                      placeholder="https://example.com/thank-you"
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#E9E7E2]">Form Fields</Label>
                  {formFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-[#333333] rounded-lg mt-2">
                      <div>
                        <Label className="text-[#E9E7E2] text-sm">Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => handleFormFieldChange(index, 'name', e.target.value)}
                          placeholder="email"
                          className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#E9E7E2] text-sm">Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => handleFormFieldChange(index, 'label', e.target.value)}
                          placeholder="Email Address"
                          className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#E9E7E2] text-sm">Type</Label>
                        <Select 
                          value={field.type} 
                          onValueChange={(value) => handleFormFieldChange(index, 'type', value)}
                        >
                          <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => handleFormFieldChange(index, 'required', checked)}
                          />
                          <Label className="text-[#E9E7E2] text-sm">Required</Label>
                        </div>
                        {formFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFormField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFormField}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Form Field
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#FF5001] hover:bg-[#FF5001]/90"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
          <Link href="/admin/campaigns">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}