'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Users, Star, ChevronDown, X, Send, ArrowLeft, Briefcase, Calendar, Mail, Phone, Globe, FileText, Shield, Building2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
}

interface ApplicationData {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  coverLetter: string;
  availability: string;
  salaryExpectation: string;
  experience: string;
}

const CareersPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jobId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
    coverLetter: '',
    availability: '',
    salaryExpectation: '',
    experience: ''
  });

  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a talented Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using modern technologies.',
      requirements: [
        '5+ years of React experience',
        'Strong TypeScript skills',
        'Experience with Next.js',
        'Knowledge of modern CSS frameworks',
        'Understanding of web performance optimization'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work flexibility',
        'Professional development budget',
        'Equity options'
      ],
      posted: '2024-01-15'
    }
  ];

  const fetchJobs = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Application submitted successfully!');
      setShowApplication(false);
      setApplicationData({
        jobId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        resumeUrl: '',
        portfolioUrl: '',
        linkedinUrl: '',
        coverLetter: '',
        availability: '',
        salaryExpectation: '',
        experience: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#161616] via-[#1a1a1a] to-[#0f0f0f] py-24"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#E9E7E2] to-[#FF5001] bg-clip-text text-transparent">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-[#E9E7E2]/80 max-w-3xl mx-auto leading-relaxed">
              Build the future with us. We're looking for passionate individuals who want to make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => {
                const jobsSection = document.getElementById('job-listings');
                jobsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const jobsSection = document.getElementById('job-listings');
                  jobsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              aria-label="View all open job positions"
              role="button"
              tabIndex={0}
              className="group relative px-8 py-4 bg-[#FF5001] text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-[#e64501] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF5001]/25 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:ring-offset-2 focus:ring-offset-[#161616] active:scale-95"
            >
              <span className="relative z-10">View Open Positions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5001] to-[#ff6b2b] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
              onClick={() => {
                const cultureSection = document.getElementById('company-culture');
                cultureSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const cultureSection = document.getElementById('company-culture');
                  cultureSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              aria-label="Learn about our company culture and benefits"
              role="button"
              tabIndex={0}
              className="group relative px-8 py-4 border-2 border-[#E9E7E2]/20 text-[#E9E7E2] rounded-xl font-semibold text-lg transition-all duration-300 hover:border-[#FF5001] hover:text-[#FF5001] hover:bg-[#FF5001]/5 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:ring-offset-2 focus:ring-offset-[#161616] active:scale-95 active:bg-[#FF5001]/10"
            >
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                Learn About Our Culture
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5001]/5 to-[#ff6b2b]/5 rounded-xl opacity-0 group-hover:opacity-100 group-focus:opacity-50 transition-opacity duration-300"></div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Company Culture Section */}
      <section id="company-culture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#E9E7E2] bg-clip-text text-transparent">
            Why Work With Us?
          </h2>
          <p className="text-xl text-[#E9E7E2]/70 max-w-3xl mx-auto">
            Join a team that values innovation, collaboration, and personal growth. We're building the future together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '🚀',
              title: 'Innovation First',
              description: 'Work with cutting-edge technologies and contribute to groundbreaking projects that shape the industry.'
            },
            {
              icon: '🌍',
              title: 'Remote Flexibility',
              description: 'Enjoy the freedom to work from anywhere while maintaining work-life balance and productivity.'
            },
            {
              icon: '📈',
              title: 'Career Growth',
              description: 'Access continuous learning opportunities, mentorship programs, and clear advancement paths.'
            },
            {
              icon: '💰',
              title: 'Competitive Benefits',
              description: 'Comprehensive health coverage, equity options, and performance-based bonuses.'
            },
            {
              icon: '🤝',
              title: 'Collaborative Culture',
              description: 'Work alongside passionate professionals in an inclusive, supportive environment.'
            },
            {
              icon: '🎯',
              title: 'Meaningful Impact',
              description: 'Contribute to projects that make a real difference for clients and communities worldwide.'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 bg-[#E9E7E2]/5 backdrop-blur-sm rounded-2xl border border-[#E9E7E2]/10 hover:border-[#FF5001]/30 transition-all duration-300 hover:bg-[#FF5001]/5"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#E9E7E2] mb-3 group-hover:text-[#FF5001] transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-[#E9E7E2]/70 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-[#FF5001]/10 to-[#ff6b2b]/10 rounded-3xl p-8 md:p-12 border border-[#FF5001]/20"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-[#E9E7E2] mb-4">
              Ready to Join Our Team?
            </h3>
            <p className="text-[#E9E7E2]/70 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for excellence and innovation.
            </p>
            <button
              onClick={() => {
                const jobsSection = document.getElementById('job-listings');
                jobsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="group relative px-8 py-4 bg-[#FF5001] text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-[#e64501] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF5001]/25"
            >
              <span className="relative z-10">Explore Open Positions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5001] to-[#ff6b2b] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Job Listings */}
      <section id="job-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#E9E7E2] bg-clip-text text-transparent">
            Open Positions
          </h2>
          <p className="text-xl text-[#E9E7E2]/70 max-w-2xl mx-auto">
            Discover exciting opportunities to grow your career with us
          </p>
        </motion.div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-[#E9E7E2]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#E9E7E2]/10 hover:border-[#FF5001]/30 transition-all duration-300 hover:bg-[#FF5001]/5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-[#E9E7E2] group-hover:text-[#FF5001] transition-colors duration-300">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#FF5001]/20 text-[#FF5001] rounded-full text-sm font-medium">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-[#E9E7E2]/20 text-[#E9E7E2] rounded-full text-sm font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-[#E9E7E2]/20 text-[#E9E7E2] rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-[#E9E7E2]/80">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#E9E7E2]/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Posted {job.posted}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#E9E7E2]/70 leading-relaxed mb-4">
                    {job.description.substring(0, 150)}...
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-6 py-3 bg-[#E9E7E2]/10 text-[#E9E7E2] rounded-xl font-semibold transition-all duration-300 hover:bg-[#E9E7E2]/20 hover:scale-105"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setApplicationData(prev => ({ ...prev, jobId: job.id }));
                      setShowApplication(true);
                    }}
                    className="px-6 py-3 bg-[#FF5001] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#e64501] hover:scale-105 hover:shadow-lg hover:shadow-[#FF5001]/25"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#E9E7E2]/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#E9E7E2] mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-[#FF5001]/20 text-[#FF5001] rounded-full text-sm font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedJob.department}
                    </span>
                    <span className="px-3 py-1 bg-[#E9E7E2]/20 text-[#E9E7E2] rounded-full text-sm font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </span>
                    <span className="px-3 py-1 bg-[#E9E7E2]/20 text-[#E9E7E2] rounded-full text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedJob.type}
                    </span>
                    <span className="px-3 py-1 bg-[#E9E7E2]/20 text-[#E9E7E2] rounded-full text-sm font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {selectedJob.salary}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-[#E9E7E2]/10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-[#E9E7E2]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#E9E7E2] mb-3">Job Description</h3>
                  <p className="text-[#E9E7E2]/80 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#E9E7E2] mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-[#E9E7E2]/80">
                        <div className="w-2 h-2 bg-[#FF5001] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => {
                      setApplicationData(prev => ({ ...prev, jobId: selectedJob.id }));
                      setShowApplication(true);
                      setSelectedJob(null);
                    }}
                    className="flex-1 px-6 py-3 bg-[#FF5001] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#e64501] hover:scale-105 hover:shadow-lg hover:shadow-[#FF5001]/25"
                  >
                    <Send className="w-5 h-5 inline mr-2" />
                    Apply for this Position
                  </button>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-3 bg-[#E9E7E2]/10 text-[#E9E7E2] rounded-xl font-semibold transition-all duration-300 hover:bg-[#E9E7E2]/20"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplication(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E9E7E2]/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#E9E7E2]">Apply for Position</h2>
                <button
                  onClick={() => setShowApplication(false)}
                  className="p-2 hover:bg-[#E9E7E2]/10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-[#E9E7E2]" />
                </button>
              </div>

              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E9E7E2] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.firstName}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#E9E7E2]/5 border border-[#E9E7E2]/20 rounded-xl text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#E9E7E2] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.lastName}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#E9E7E2]/5 border border-[#E9E7E2]/20 rounded-xl text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E9E7E2] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#E9E7E2]/5 border border-[#E9E7E2]/20 rounded-xl text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E9E7E2] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#E9E7E2]/5 border border-[#E9E7E2]/20 rounded-xl text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E9E7E2] mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#E9E7E2]/5 border border-[#E9E7E2]/20 rounded-xl text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5001] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplication(false)}
                    className="px-6 py-3 bg-[#E9E7E2]/10 text-[#E9E7E2] rounded-xl font-semibold transition-all duration-300 hover:bg-[#E9E7E2]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-[#FF5001] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#e64501] hover:scale-105 hover:shadow-lg hover:shadow-[#FF5001]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 inline mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareersPage;