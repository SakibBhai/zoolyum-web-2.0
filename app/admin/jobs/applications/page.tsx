"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, Search, Filter, Mail, Phone, Calendar, MapPin, Briefcase } from "lucide-react"
import { format } from "date-fns"

interface JobApplication {
  id: string
  fullName: string
  email: string
  phone?: string
  portfolioUrl?: string
  resumeUrl?: string
  coverLetter?: string
  appliedAt: string
  job: {
    id: string
    title: string
    department: string
    location: string
    type: string
  }
}

interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  shortlisted: number
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [stats, setStats] = useState<ApplicationStats>({ total: 0, pending: 0, reviewed: 0, shortlisted: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJob, setFilterJob] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([])

  useEffect(() => {
    fetchApplications()
    fetchJobs()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/jobs/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = filterJob === "all" || app.job.id === filterJob
    return matchesSearch && matchesJob
  })

  const downloadResume = (resumeUrl: string, applicantName: string) => {
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = `${applicantName}_Resume.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5001]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Job Applications</h1>
          <p className="text-[#E9E7E2]/70">Manage and review job applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#E9E7E2]/70">Total Applications</p>
                <p className="text-2xl font-bold text-[#E9E7E2]">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-[#FF5001]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#E9E7E2]/70">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#E9E7E2]/85">Reviewed</p> {/* Changed from /70 to /85 for better visibility */}
                <p className="text-2xl font-bold text-blue-500">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#E9E7E2]/85">Shortlisted</p> {/* Changed from /70 to /85 for better visibility */}
                <p className="text-2xl font-bold text-green-500">{stats.shortlisted}</p>
              </div>
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E9E7E2]/50 h-4 w-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#252525] border-[#333333] text-[#E9E7E2]"
              />
            </div>
            <Select value={filterJob} onValueChange={setFilterJob}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#252525] border-[#333333] text-[#E9E7E2]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent className="bg-[#252525] border-[#333333]">
                <SelectItem value="all">All Jobs</SelectItem>
                {(jobs || []).map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-[#E9E7E2]">Applications ({(filteredApplications || []).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(filteredApplications || []).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#E9E7E2]/70">No applications found</p>
              </div>
            ) : (
              (filteredApplications || []).map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[#333333] rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <div className="flex-1 space-y-2 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-[#E9E7E2]">{application.fullName}</h3>
                      <Badge variant="outline" className="w-fit">
                        {application.job.title}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-[#E9E7E2]/70">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {application.email}
                      </div>
                      {application.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {application.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-[#333333] hover:bg-[#252525]"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-[#E9E7E2]">
                            Application Details - {selectedApplication?.fullName}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-[#E9E7E2] mb-2">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#FF5001]" />
                                    <span className="text-[#E9E7E2]/70">{selectedApplication.email}</span>
                                  </div>
                                  {selectedApplication.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-[#FF5001]" />
                                      <span className="text-[#E9E7E2]/70">{selectedApplication.phone}</span>
                                    </div>
                                  )}
                                  {selectedApplication.portfolioUrl && (
                                    <div className="flex items-center gap-2">
                                      <Eye className="h-4 w-4 text-[#FF5001]" />
                                      <a
                                        href={selectedApplication.portfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FF5001] hover:underline"
                                      >
                                        View Portfolio
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#E9E7E2] mb-2">Job Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-[#FF5001]" />
                                    <span className="text-[#E9E7E2]/70">{selectedApplication.job.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#FF5001]" />
                                    <span className="text-[#E9E7E2]/70">{selectedApplication.job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[#FF5001]" />
                                    <span className="text-[#E9E7E2]/70">
                                      Applied on {format(new Date(selectedApplication.appliedAt), 'MMMM dd, yyyy')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {selectedApplication.coverLetter && (
                              <div>
                                <h4 className="font-semibold text-[#E9E7E2] mb-2">Cover Letter</h4>
                                <div className="bg-[#252525] p-4 rounded-lg">
                                  <p className="text-[#E9E7E2]/70 whitespace-pre-wrap">
                                    {selectedApplication.coverLetter}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2">
                              {selectedApplication.resumeUrl && (
                                <Button
                                  onClick={() => downloadResume(selectedApplication.resumeUrl!, selectedApplication.fullName)}
                                  className="bg-[#FF5001] hover:bg-[#FF5001]/90"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Resume
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    {application.resumeUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadResume(application.resumeUrl!, application.fullName)}
                        className="border-[#333333] hover:bg-[#252525]"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}