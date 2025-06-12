'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import { AdminLoading } from '@/components/admin/admin-loading'

interface FormField {
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required: boolean
  options?: string[]
}

interface CTA {
  id?: string
  label: string
  url: string
  order: number
}

interface Campaign {
  id: string
  title: string
  slug: string
  shortDescription?: string
  content?: string
  startDate?: string
  endDate?: string
  status: string
  imageUrls: string[]
  videoUrls: string[]
  enableForm: boolean
  formFields?: FormField[]
  successMessage?: string
  redirectUrl?: string
  ctas: CTA[]
}

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [videoUrls, setVideoUrls] = useState<string[]>([''])
  const [enableForm, setEnableForm] = useState(false)
  const [formFields, setFormFields] = useState<FormField[]>([{ label: 'Name', type: 'text', required: true }])
  const [successMessage, setSuccessMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [ctas, setCtas] = useState<CTA[]>([{ label: '', url: '', order: 0 }])

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCampaign(data)
          
          // Populate form fields
          setTitle(data.title)
          setSlug(data.slug)
          setShortDescription(data.shortDescription || '')
          setContent(data.content || '')
          setStartDate(data.startDate ? data.startDate.split('T')[0] : '')
          setEndDate(data.endDate ? data.endDate.split('T')[0] : '')
          setStatus(data.status)
          setImageUrls(data.imageUrls.length > 0 ? data.imageUrls : [''])
          setVideoUrls(data.videoUrls.length > 0 ? data.videoUrls : [''])
          setEnableForm(data.enableForm)
          setFormFields(data.formFields || [{ label: 'Name', type: 'text', required: true }])
          setSuccessMessage(data.successMessage || '')
          setRedirectUrl(data.redirectUrl || '')
          setCtas(data.ctas.length > 0 ? data.ctas : [{ label: '', url: '', order: 0 }])
        } else {
          router.push('/admin/campaigns')
        }
      } catch (error) {
        console.error('Error fetching campaign:', error)
        router.push('/admin/campaigns')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCampaign()
    }
  }, [params.id, router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === generateSlug(campaign?.title || '')) {
      setSlug(generateSlug(value))
    }
  }

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index))
    }
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, ''])
  }

  const removeVideoUrl = (index: number) => {
    if (videoUrls.length > 1) {
      setVideoUrls(videoUrls.filter((_, i) => i !== index))
    }
  }

  const updateVideoUrl = (index: number, value: string) => {
    const newUrls = [...videoUrls]
    newUrls[index] = value
    setVideoUrls(newUrls)
  }

  const addFormField = () => {
    setFormFields([...formFields, { label: '', type: 'text', required: false }])
  }

  const removeFormField = (index: number) => {
    if (formFields.length > 1) {
      setFormFields(formFields.filter((_, i) => i !== index))
    }
  }

  const updateFormField = (index: number, field: Partial<FormField>) => {
    const newFields = [...formFields]
    newFields[index] = { ...newFields[index], ...field }
    setFormFields(newFields)
  }

  const addCTA = () => {
    setCtas([...ctas, { label: '', url: '', order: ctas.length }])
  }

  const removeCTA = (index: number) => {
    if (ctas.length > 1) {
      setCtas(ctas.filter((_, i) => i !== index))
    }
  }

  const updateCTA = (index: number, field: Partial<CTA>) => {
    const newCtas = [...ctas]
    newCtas[index] = { ...newCtas[index], ...field }
    setCtas(newCtas)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const campaignData = {
        title,
        slug,
        shortDescription: shortDescription || undefined,
        content: content || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        status,
        imageUrls: imageUrls.filter(url => url.trim() !== ''),
        videoUrls: videoUrls.filter(url => url.trim() !== ''),
        enableForm,
        formFields: enableForm ? formFields.filter(field => field.label.trim() !== '') : undefined,
        successMessage: enableForm && successMessage ? successMessage : undefined,
        redirectUrl: enableForm && redirectUrl ? redirectUrl : undefined,
        ctas: ctas.filter(cta => cta.label.trim() !== '' && cta.url.trim() !== '')
      }

      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (response.ok) {
        router.push(`/admin/campaigns/${params.id}`)
      } else {
        const error = await response.json()
        alert(`Error updating campaign: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating campaign:', error)
      alert('Error updating campaign. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AdminLoading />
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#E9E7E2]">Campaign not found</h2>
        <Link href="/admin/campaigns">
          <Button className="mt-4">Back to Campaigns</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/campaigns/${params.id}`}>
            <Button variant="ghost" size="icon" asChild>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">Edit Campaign</h1>
            <p className="text-[#E9E7E2]/60 mt-1">Update campaign details and settings</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Basic Information</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Essential campaign details and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#E9E7E2]">Campaign Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-[#E9E7E2]">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-[#E9E7E2]">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                rows={2}
                placeholder="Brief description for meta tags and summaries"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-[#E9E7E2]">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                rows={6}
                placeholder="Full campaign content (supports HTML)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Status */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Schedule & Status</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Campaign timing and publication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#E9E7E2]">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252525] border-[#333333]">
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-[#E9E7E2]">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-[#E9E7E2]">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Integration */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Media Integration</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Images and videos for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[#E9E7E2]">Image URLs</Label>
                <Button type="button" onClick={addImageUrl} size="sm" variant="outline" asChild>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      size="icon"
                      variant="outline"
                      asChild
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator className="bg-[#333333]" />

            {/* Videos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[#E9E7E2]">Video URLs (YouTube)</Label>
                <Button type="button" onClick={addVideoUrl} size="sm" variant="outline" asChild>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </div>
              {videoUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateVideoUrl(index, e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                  {videoUrls.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeVideoUrl(index)}
                      size="icon"
                      variant="outline"
                      asChild
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call-to-Action Buttons */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Call-to-Action Buttons</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Add action buttons to drive user engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[#E9E7E2]">CTA Buttons</Label>
              <Button type="button" onClick={addCTA} size="sm" variant="outline" asChild>
                <Plus className="h-4 w-4 mr-2" />
                Add CTA
              </Button>
            </div>
            {ctas.map((cta, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={cta.label}
                  onChange={(e) => updateCTA(index, { label: e.target.value })}
                  placeholder="Button Label"
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
                <div className="flex gap-2">
                  <Input
                    value={cta.url}
                    onChange={(e) => updateCTA(index, { url: e.target.value })}
                    placeholder="https://example.com"
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  />
                  {ctas.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeCTA(index)}
                      size="icon"
                      variant="outline"
                      asChild
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lead Capture Form */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Lead Capture Form</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Optional form to collect user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableForm"
                checked={enableForm}
                onCheckedChange={setEnableForm}
              />
              <Label htmlFor="enableForm" className="text-[#E9E7E2]">
                Enable lead capture form
              </Label>
            </div>

            {enableForm && (
              <div className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#E9E7E2]">Form Fields</Label>
                    <Button type="button" onClick={addFormField} size="sm" variant="outline" asChild>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                  {formFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={field.label}
                        onChange={(e) => updateFormField(index, { label: e.target.value })}
                        placeholder="Field Label"
                        className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      />
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateFormField(index, { type: value as FormField['type'] })}
                      >
                        <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] border-[#333333]">
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateFormField(index, { required: checked })}
                        />
                        <Label className="text-[#E9E7E2] text-sm">Required</Label>
                      </div>
                      {formFields.length > 1 && (
                        <Button
                          type="button"
                      onClick={() => removeFormField(index)}
                      className="h-8 w-8 p-0"
                      variant="outline"
                      asChild
                    >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="successMessage" className="text-[#E9E7E2]">Success Message</Label>
                    <Textarea
                      id="successMessage"
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      rows={3}
                      placeholder="Thank you for your submission!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redirectUrl" className="text-[#E9E7E2]">Redirect URL (Optional)</Label>
                    <Input
                      id="redirectUrl"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="https://example.com/thank-you"
                    />
                    <p className="text-xs text-[#E9E7E2]/60">
                      Leave empty to show success message instead
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href={`/admin/campaigns/${params.id}`}>
            <Button type="button" variant="outline" asChild>
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-[#FF5001] hover:bg-[#FF5001]/90"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Campaign
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}