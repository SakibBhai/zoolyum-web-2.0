'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

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
  published: boolean;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobFormData {
  title: string;
  department: string;
  location: string;
  jobType: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  description: string;
  requirements: string;
  responsibilities: string;
  perks: string;
  skills: string[];
  experience: string;
  featured: boolean;
  published: boolean;
  applicationDeadline: string;
}

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
];

const employmentTypes = [
  'Permanent',
  'Contract',
  'Temporary',
  'Internship',
  'Freelance',
];

const departments = [
  'Design',
  'Development',
  'Marketing',
  'Sales',
  'Operations',
  'HR',
  'Finance',
  'Strategy',
  'Creative',
  'Account Management',
];

const locations = [
  'Remote',
  'On-site',
  'Hybrid',
  'New York, NY',
  'Los Angeles, CA',
  'San Francisco, CA',
  'Chicago, IL',
  'Austin, TX',
  'Miami, FL',
];

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
];

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Job not found');
        }
        
        const jobData: Job = await response.json();
        setJob(jobData);
        
        // Convert job data to form data
        setFormData({
          title: jobData.title,
          department: jobData.department,
          location: jobData.location,
          jobType: jobData.jobType,
          employmentType: jobData.employmentType,
          salaryMin: jobData.salaryMin?.toString() || '',
          salaryMax: jobData.salaryMax?.toString() || '',
          salaryCurrency: jobData.salaryCurrency || 'USD',
          description: jobData.description,
          requirements: jobData.requirements,
          responsibilities: jobData.responsibilities,
          perks: jobData.perks || '',
          skills: jobData.skills,
          experience: jobData.experience || '',
          featured: jobData.featured,
          published: jobData.published,
          applicationDeadline: jobData.applicationDeadline 
            ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] 
            : '',
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job data');
        router.push('/admin/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    if (!formData) return;
    
    setFormData(prev => ({
      ...prev!,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (!formData) return;
    
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev!,
        skills: [...prev!.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!formData) return;
    
    setFormData(prev => ({
      ...prev!,
      skills: prev!.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    
    if (!formData || !formData.title.trim() || !formData.department.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const submitData = {
        ...formData,
        published: asDraft ? false : formData.published,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
      };

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }

      const result = await response.json();
      toast.success(`Job ${asDraft ? 'saved as draft' : 'updated'} successfully!`);
      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (!job || !formData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
        <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
        <Link href="/admin/jobs">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600 mt-1">
              Update job posting: {job.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
          >
            Save as Draft
          </Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Update Job'}
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about the job position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select
                      value={formData.jobType}
                      onValueChange={(value) => handleInputChange('jobType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange('employmentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g. 3-5 years, Entry level, Senior level"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Detailed information about the role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a comprehensive description of the role..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                    placeholder="List the main responsibilities and duties..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="List the required qualifications, skills, and experience..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="perks">Perks & Benefits</Label>
                  <Textarea
                    id="perks"
                    value={formData.perks}
                    onChange={(e) => handleInputChange('perks', e.target.value)}
                    placeholder="Describe the benefits, perks, and company culture..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Add relevant skills and technologies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. React, TypeScript)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {(formData?.skills || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
                <CardDescription>
                  Optional salary range details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="salaryCurrency">Currency</Label>
                  <Select
                    value={formData.salaryCurrency}
                    onValueChange={(value) => handleInputChange('salaryCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="salaryMin">Min Salary</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Max Salary</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      placeholder="80000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
                <CardDescription>
                  Control job visibility and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="published">Published</Label>
                    <p className="text-sm text-gray-600">
                      Make this job visible on careers page
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange('published', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured</Label>
                    <p className="text-sm text-gray-600">
                      Highlight this job on the careers page
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Leave empty for no deadline
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Job Info */}
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>
                  Current job details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Created:</span>
                  <br />
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Last Updated:</span>
                  <br />
                  {new Date(job.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Slug:</span>
                  <br />
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                    {job.slug}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your job will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/careers" target="_blank">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Careers Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}