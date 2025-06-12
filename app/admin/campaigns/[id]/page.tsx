'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, BarChart3, ExternalLink, Calendar, Users, Eye } from 'lucide-react'
import { AdminLoading } from '@/components/admin/admin-loading'

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
  formFields?: any
  successMessage?: string
  redirectUrl?: string
  views: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
  ctas: Array<{
    id: string
    label: string
    url: string
    order: number
  }>
  submissions: Array<{
    id: string
    data: any
    createdAt: string
  }>
}

export default function CampaignViewPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCampaign(data)
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'secondary' as const, label: 'Draft' },
      SCHEDULED: { variant: 'outline' as const, label: 'Scheduled' },
      PUBLISHED: { variant: 'default' as const, label: 'Published' },
      ARCHIVED: { variant: 'destructive' as const, label: 'Archived' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString()
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaigns">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#E9E7E2]">{campaign.title}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-[#E9E7E2]/60 mt-1">Campaign Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/campaigns/${campaign.id}/analytics`}>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href={`/admin/campaigns/${campaign.id}/edit`}>
            <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#E9E7E2]/60">Slug</h3>
                <p className="text-[#E9E7E2]">{campaign.slug}</p>
              </div>
              
              {campaign.shortDescription && (
                <div>
                  <h3 className="text-sm font-medium text-[#E9E7E2]/60">Short Description</h3>
                  <p className="text-[#E9E7E2]">{campaign.shortDescription}</p>
                </div>
              )}
              
              {campaign.content && (
                <div>
                  <h3 className="text-sm font-medium text-[#E9E7E2]/60">Content</h3>
                  <div 
                    className="text-[#E9E7E2] prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.content }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          {(campaign.imageUrls.length > 0 || campaign.videoUrls.length > 0) && (
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Images */}
                {campaign.imageUrls.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#E9E7E2]/60 mb-3">Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {campaign.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Campaign image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {campaign.videoUrls.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#E9E7E2]/60 mb-3">Videos</h3>
                    <div className="space-y-4">
                      {campaign.videoUrls.map((url, index) => {
                        const embedUrl = getYouTubeEmbedUrl(url)
                        return (
                          <div key={index}>
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                className="w-full h-64 rounded-lg"
                                allowFullScreen
                                title={`Campaign video ${index + 1}`}
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-4 bg-[#252525] rounded-lg">
                                <ExternalLink className="h-4 w-4 text-[#E9E7E2]/60" />
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#FF5001] hover:underline"
                                >
                                  {url}
                                </a>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Call-to-Action Buttons */}
          {campaign.ctas.length > 0 && (
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Call-to-Action Buttons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.ctas.map((cta) => (
                    <div key={cta.id} className="flex items-center justify-between p-3 bg-[#252525] rounded-lg">
                      <div>
                        <p className="font-medium text-[#E9E7E2]">{cta.label}</p>
                        <p className="text-sm text-[#E9E7E2]/60">{cta.url}</p>
                      </div>
                      <a 
                        href={cta.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FF5001] hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lead Capture Form */}
          {campaign.enableForm && (
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Lead Capture Form</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Form is enabled for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.formFields && (
                  <div>
                    <h3 className="text-sm font-medium text-[#E9E7E2]/60 mb-2">Form Fields</h3>
                    <div className="space-y-2">
                      {campaign.formFields.map((field: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#252525] rounded">
                          <span className="text-[#E9E7E2]">{field.label}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                            {field.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaign.successMessage && (
                  <div>
                    <h3 className="text-sm font-medium text-[#E9E7E2]/60">Success Message</h3>
                    <p className="text-[#E9E7E2]">{campaign.successMessage}</p>
                  </div>
                )}
                
                {campaign.redirectUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-[#E9E7E2]/60">Redirect URL</h3>
                    <a 
                      href={campaign.redirectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#FF5001] hover:underline"
                    >
                      {campaign.redirectUrl}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Campaign Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-[#FF5001]" />
                <div>
                  <p className="text-2xl font-bold text-[#E9E7E2]">{campaign.views}</p>
                  <p className="text-sm text-[#E9E7E2]/60">Views</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#FF5001]" />
                <div>
                  <p className="text-2xl font-bold text-[#E9E7E2]">{campaign.submissions.length}</p>
                  <p className="text-sm text-[#E9E7E2]/60">Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#E9E7E2]/60" />
                  <span className="text-sm font-medium text-[#E9E7E2]/60">Start Date</span>
                </div>
                <p className="text-[#E9E7E2]">{formatDate(campaign.startDate)}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#E9E7E2]/60" />
                  <span className="text-sm font-medium text-[#E9E7E2]/60">End Date</span>
                </div>
                <p className="text-[#E9E7E2]">{formatDate(campaign.endDate)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#E9E7E2]/60">Author</h3>
                <p className="text-[#E9E7E2]">{campaign.author.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#E9E7E2]/60">Created</h3>
                <p className="text-[#E9E7E2]">{formatDate(campaign.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#E9E7E2]/60">Last Updated</h3>
                <p className="text-[#E9E7E2]">{formatDate(campaign.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          {campaign.submissions.length > 0 && (
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-[#E9E7E2]">Recent Submissions</CardTitle>
                <CardDescription className="text-[#E9E7E2]/60">
                  Latest form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="p-3 bg-[#252525] rounded-lg">
                      <p className="text-sm text-[#E9E7E2]/60 mb-1">
                        {formatDate(submission.createdAt)}
                      </p>
                      <div className="text-sm text-[#E9E7E2]">
                        {Object.entries(submission.data).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {campaign.submissions.length > 5 && (
                    <Link href={`/admin/campaigns/${campaign.id}/analytics`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Submissions
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}