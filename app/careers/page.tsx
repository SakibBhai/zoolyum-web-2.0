'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Users, X, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  jobType: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  requirements: string;
  responsibilities: string;
  perks?: string;
  skills: string[];
  experience?: string;
  featured: boolean;
  applicationDeadline?: string;
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  experience: string;
  availability: string;
  salaryExpectation: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
    experience: '',
    availability: '',
    salaryExpectation: '',
  });

  // Fetch jobs with filters
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (departmentFilter) params.append('department', departmentFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (jobTypeFilter) params.append('jobType', jobTypeFilter);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data: JobsResponse = await response.json();
      setJobs(data.jobs);

      // Extract unique departments and locations for filters
      const uniqueDepartments = [...new Set(data.jobs.map(job => job.department))];
      const uniqueLocations = [...new Set(data.jobs.map(job => job.location))];
      setDepartments(uniqueDepartments);
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, departmentFilter, locationFilter, jobTypeFilter]);

  // Handle job application submission
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setSubmitting(true);
      const formData = {
        ...applicationForm,
        salaryExpectation: applicationForm.salaryExpectation ? parseFloat(applicationForm.salaryExpectation) : undefined,
      };

      const response = await fetch(`/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully! We\'ll be in touch soon.');
      setShowApplicationForm(false);
      setSelectedJob(null);
      setApplicationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: '',
        resumeUrl: '',
        portfolioUrl: '',
        linkedinUrl: '',
        experience: '',
        availability: '',
        salaryExpectation: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return null;
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}`;
    }
    if (min) return `From $${min.toLocaleString()} ${currency}`;
    if (max) return `Up to $${max.toLocaleString()} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-blue-600">Creative Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              At Features Digital, we're building the future of branding and marketing. 
              Join a team of passionate creatives, strategists, and innovators who are 
              redefining how brands connect with their audiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h2>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${jobs.length} position${jobs.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                        onClick={() => setSelectedJob(job)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {job.title}
                            {job.featured && (
                              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                                Featured
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {job.department}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.location} • {job.employmentType}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {job.jobType}
                          {job.experience && ` • ${job.experience}`}
                        </div>
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency) && (
                          <div className="text-sm font-medium text-green-600">
                            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                          </div>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a company that values creativity, innovation, and personal growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Creative Freedom',
                description: 'Express your creativity and bring innovative ideas to life with full creative autonomy.',
                icon: '🎨',
              },
              {
                title: 'Remote Flexibility',
                description: 'Work from anywhere with our flexible remote-first culture and work-life balance.',
                icon: '🌍',
              },
              {
                title: 'Growth Opportunities',
                description: 'Continuous learning, skill development, and clear career advancement paths.',
                icon: '📈',
              },
              {
                title: 'Collaborative Culture',
                description: 'Work with passionate professionals in a supportive and inclusive environment.',
                icon: '🤝',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't see the perfect role? We're always looking for talented individuals to join our team.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => !showApplicationForm && setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showApplicationForm ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>{selectedJob.department}</span>
                        <span>•</span>
                        <span>{selectedJob.location}</span>
                        <span>•</span>
                        <span>{selectedJob.jobType}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedJob(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {selectedJob.description.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {selectedJob.responsibilities.split('\n').map((item, index) => (
                          <p key={index} className="mb-2">{item}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {selectedJob.requirements.split('\n').map((item, index) => (
                          <p key={index} className="mb-2">{item}</p>
                        ))}
                      </div>
                    </div>

                    {selectedJob.perks && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Perks & Benefits</h3>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {selectedJob.perks.split('\n').map((perk, index) => (
                            <p key={index} className="mb-2">{perk}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedJob.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Compensation</h3>
                        <p className="text-green-600 font-medium">
                          {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t">
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="flex-1"
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedJob(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Apply for {selectedJob.title}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowApplicationForm(false);
                        setSelectedJob(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleApplicationSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={applicationForm.firstName}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={applicationForm.lastName}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={applicationForm.email}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="resumeUrl">Resume URL</Label>
                      <Input
                        id="resumeUrl"
                        type="url"
                        placeholder="https://..."
                        value={applicationForm.resumeUrl}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, resumeUrl: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                        <Input
                          id="portfolioUrl"
                          type="url"
                          placeholder="https://..."
                          value={applicationForm.portfolioUrl}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={applicationForm.linkedinUrl}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        rows={4}
                        placeholder="Tell us why you're interested in this position..."
                        value={applicationForm.coverLetter}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Input
                          id="availability"
                          placeholder="e.g., Immediate, 2 weeks notice"
                          value={applicationForm.availability}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, availability: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="salaryExpectation">Salary Expectation (USD)</Label>
                        <Input
                          id="salaryExpectation"
                          type="number"
                          placeholder="e.g., 75000"
                          value={applicationForm.salaryExpectation}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, salaryExpectation: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="experience">Relevant Experience</Label>
                      <Textarea
                        id="experience"
                        rows={3}
                        placeholder="Briefly describe your relevant experience..."
                        value={applicationForm.experience}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApplicationForm(false)}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}