'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Briefcase, Star, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalContacts: number;
  totalTestimonials: number;
  totalProjects: number;
  totalBlogPosts: number;
  recentActivity: Array<{
    id: string;
    type: 'contact' | 'testimonial' | 'project' | 'blog';
    title: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalTestimonials: 0,
    totalProjects: 0,
    totalBlogPosts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch contacts
        const contactsRes = await fetch('/api/contacts');
        const contacts = contactsRes.ok ? await contactsRes.json() : [];
        
        // Fetch testimonials
        const testimonialsRes = await fetch('/api/testimonials');
        const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
        
        // Mock data for projects and blog posts (you can implement these APIs later)
        const projects = [];
        const blogPosts = [];
        
        // Create recent activity from available data
        const recentActivity = [
          ...contacts.slice(0, 3).map((contact: any) => ({
            id: contact.id,
            type: 'contact' as const,
            title: `New contact from ${contact.name}`,
            date: new Date(contact.created_at).toLocaleDateString()
          })),
          ...testimonials.slice(0, 3).map((testimonial: any) => ({
            id: testimonial.id,
            type: 'testimonial' as const,
            title: `New testimonial from ${testimonial.name}`,
            date: new Date(testimonial.created_at).toLocaleDateString()
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
        
        setStats({
          totalContacts: contacts.length,
          totalTestimonials: testimonials.length,
          totalProjects: projects.length,
          totalBlogPosts: blogPosts.length,
          recentActivity
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/contacts'
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/admin/testimonials'
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/dashboard/projects'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/dashboard/blog'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return Users;
      case 'testimonial':
        return Star;
      case 'project':
        return Briefcase;
      case 'blog':
        return MessageSquare;
      default:
        return Calendar;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'text-blue-600';
      case 'testimonial':
        return 'text-yellow-600';
      case 'project':
        return 'text-green-600';
      case 'blog':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF5001]" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates across your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Icon className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/dashboard/blog/new">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create New Blog Post
                </Button>
              </Link>
              <Link href="/admin/dashboard/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Add New Project
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Contacts
                </Button>
              </Link>
              <Link href="/admin/testimonials">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Manage Testimonials
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}