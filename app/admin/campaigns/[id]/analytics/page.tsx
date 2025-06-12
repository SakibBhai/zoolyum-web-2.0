'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Eye, Users, Calendar, Download, ExternalLink } from 'lucide-react'
import { AdminLoading } from '@/components/admin/admin-loading'

interface Campaign {
  id: string
  title: string
  slug: string
  status: string
  views: number
  createdAt: string
  startDate?: string
  endDate?: string
  author: {
    name: string
  }
}

interface Submission {
  id: string
  data: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

interface AnalyticsData {
  campaign: Campaign
  submissions: Submission[]
  totalSubmissions: number
  submissionsToday: number
  submissionsThisWeek: number
  submissionsThisMonth: number
  averageSubmissionsPerDay: number
  conversionRate: number
}

export default function CampaignAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [campaignResponse, submissionsResponse] = await Promise.all([
          fetch(`/api/campaigns/${params.id}`),
          fetch(`/api/campaigns/${params.id}/submissions?page=${page}&limit=20`)
        ])

        if (campaignResponse.ok && submissionsResponse.ok) {
          const campaign = await campaignResponse.json()
          const submissionsData = await submissionsResponse.json()
          
          // Calculate analytics
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
          
          const submissionsToday = submissionsData.submissions.filter((s: Submission) => 
            new Date(s.createdAt) >= today
          ).length
          
          const submissionsThisWeek = submissionsData.submissions.filter((s: Submission) => 
            new Date(s.createdAt) >= weekAgo
          ).length
          
          const submissionsThisMonth = submissionsData.submissions.filter((s: Submission) => 
            new Date(s.createdAt) >= monthAgo
          ).length
          
          const campaignStartDate = campaign.createdAt ? new Date(campaign.createdAt) : today
          const daysSinceStart = Math.max(1, Math.ceil((now.getTime() - campaignStartDate.getTime()) / (1000 * 60 * 60 * 24)))
          const averageSubmissionsPerDay = submissionsData.total / daysSinceStart
          
          const conversionRate = campaign.views > 0 ? (submissionsData.total / campaign.views) * 100 : 0
          
          setAnalytics({
            campaign,
            submissions: submissionsData.submissions,
            totalSubmissions: submissionsData.total,
            submissionsToday,
            submissionsThisWeek,
            submissionsThisMonth,
            averageSubmissionsPerDay,
            conversionRate
          })
          
          setHasMore(submissionsData.hasMore)
        } else {
          router.push('/admin/campaigns')
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        router.push('/admin/campaigns')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalytics()
    }
  }, [params.id, router, page])

  const loadMoreSubmissions = async () => {
    if (!hasMore) return
    
    try {
      const response = await fetch(`/api/campaigns/${params.id}/submissions?page=${page + 1}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(prev => prev ? {
          ...prev,
          submissions: [...prev.submissions, ...data.submissions]
        } : null)
        setPage(page + 1)
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Error loading more submissions:', error)
    }
  }

  const exportSubmissions = () => {
    if (!analytics) return
    
    const csvContent = [
      // Header
      ['Submission Date', 'IP Address', 'User Agent', ...Object.keys(analytics.submissions[0]?.data || {})].join(','),
      // Data rows
      ...analytics.submissions.map(submission => [
        new Date(submission.createdAt).toLocaleString(),
        submission.ipAddress || 'N/A',
        `"${submission.userAgent || 'N/A'}"`,
        ...Object.values(submission.data).map(value => `"${String(value)}"`)
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analytics.campaign.slug}-submissions.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return <AdminLoading />
  }

  if (!analytics) {
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
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#E9E7E2]">{analytics.campaign.title}</h1>
              {getStatusBadge(analytics.campaign.status)}
            </div>
            <p className="text-[#E9E7E2]/60 mt-1">Campaign Analytics & Performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          {analytics.submissions.length > 0 && (
            <Button onClick={exportSubmissions} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          <Link href={`/admin/campaigns/${analytics.campaign.id}/edit`}>
            <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
              Edit Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-[#FF5001]" />
              <div>
                <p className="text-2xl font-bold text-[#E9E7E2]">{analytics.campaign.views}</p>
                <p className="text-sm text-[#E9E7E2]/60">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[#FF5001]" />
              <div>
                <p className="text-2xl font-bold text-[#E9E7E2]">{analytics.totalSubmissions}</p>
                <p className="text-sm text-[#E9E7E2]/60">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#FF5001]" />
              <div>
                <p className="text-2xl font-bold text-[#E9E7E2]">{analytics.averageSubmissionsPerDay.toFixed(1)}</p>
                <p className="text-sm text-[#E9E7E2]/60">Avg. per Day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#FF5001] flex items-center justify-center text-white font-bold">
                %
              </div>
              <div>
                <p className="text-2xl font-bold text-[#E9E7E2]">{analytics.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-[#E9E7E2]/60">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#E9E7E2] text-lg">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#E9E7E2]">{analytics.submissionsToday}</p>
            <p className="text-sm text-[#E9E7E2]/60">Submissions today</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#E9E7E2] text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#E9E7E2]">{analytics.submissionsThisWeek}</p>
            <p className="text-sm text-[#E9E7E2]/60">Submissions this week</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#E9E7E2] text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#E9E7E2]">{analytics.submissionsThisMonth}</p>
            <p className="text-sm text-[#E9E7E2]/60">Submissions this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Information */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-[#E9E7E2]">Campaign Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-[#E9E7E2]/60">Author</p>
              <p className="text-[#E9E7E2]">{analytics.campaign.author.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#E9E7E2]/60">Created</p>
              <p className="text-[#E9E7E2]">{formatDate(analytics.campaign.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#E9E7E2]/60">Start Date</p>
              <p className="text-[#E9E7E2]">
                {analytics.campaign.startDate ? formatDate(analytics.campaign.startDate) : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#E9E7E2]/60">End Date</p>
              <p className="text-[#E9E7E2]">
                {analytics.campaign.endDate ? formatDate(analytics.campaign.endDate) : 'Not set'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-[#E9E7E2]">Form Submissions</CardTitle>
          <CardDescription className="text-[#E9E7E2]/60">
            {analytics.totalSubmissions > 0 
              ? `Showing ${analytics.submissions.length} of ${analytics.totalSubmissions} submissions`
              : 'No submissions yet'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.submissions.length > 0 ? (
            <div className="space-y-4">
              {analytics.submissions.map((submission) => (
                <div key={submission.id} className="p-4 bg-[#252525] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-[#E9E7E2]/60">
                      {formatDate(submission.createdAt)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#E9E7E2]/40">
                      {submission.ipAddress && (
                        <span>IP: {submission.ipAddress}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(submission.data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-[#E9E7E2]/60 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-[#E9E7E2] break-words">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                  
                  {submission.userAgent && (
                    <div className="mt-3 pt-3 border-t border-[#333333]">
                      <p className="text-xs text-[#E9E7E2]/40 truncate">
                        User Agent: {submission.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {hasMore && (
                <div className="text-center pt-4">
                  <Button onClick={loadMoreSubmissions} variant="outline">
                    Load More Submissions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-[#E9E7E2]/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E9E7E2] mb-2">No submissions yet</h3>
              <p className="text-[#E9E7E2]/60 mb-4">
                Once users start submitting the form, their data will appear here.
              </p>
              <Link href={`/campaigns/${analytics.campaign.slug}`}>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Campaign Page
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}