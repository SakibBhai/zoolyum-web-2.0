'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash, Star, Mail, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  designation: string | null;
  websiteTag: string | null;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  status: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ViewTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/team/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team member');
        }
        const data = await response.json();
        setTeamMember(data);
      } catch (error) {
        console.error('Error fetching team member:', error);
        toast.error('Failed to load team member');
        router.push('/admin/team');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTeamMember();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!teamMember || !confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/team/${teamMember.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }

      toast.success('Team member deleted successfully');
      router.push('/admin/team');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Member</h1>
            <p className="text-muted-foreground">
              View team member details
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Member Not Found</h1>
            <p className="text-muted-foreground">
              The requested team member could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              {teamMember.name}
              {teamMember.featured && (
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
              )}
            </h1>
            <p className="text-muted-foreground">
              Team member details and information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/team/${teamMember.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Team member's basic details and role information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Name</h3>
                  <p className="font-semibold">{teamMember.name}</p>
                </div>
                {teamMember.position && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Position</h3>
                    <p>{teamMember.position}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMember.designation && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Designation</h3>
                    <div className="inline-block">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        {teamMember.designation}
                      </Badge>
                    </div>
                  </div>
                )}
                {teamMember.websiteTag && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Website Tag</h3>
                    <p className="italic text-gray-600">{teamMember.websiteTag}</p>
                  </div>
                )}
              </div>
              
              {teamMember.bio && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Bio</h3>
                  <p className="text-sm leading-relaxed">{teamMember.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Contact details and social media links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMember.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${teamMember.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {teamMember.email}
                  </a>
                </div>
              )}
              
              {teamMember.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={teamMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              
              {teamMember.twitter && (
                <div className="flex items-center gap-3">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={teamMember.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    Twitter Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              
              {!teamMember.email && !teamMember.linkedin && !teamMember.twitter && (
                <p className="text-muted-foreground text-sm">No contact information available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>
                Team member's profile photo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="relative h-48 w-48 rounded-lg overflow-hidden bg-muted">
                  {teamMember.imageUrl ? (
                    <Image
                      src={teamMember.imageUrl}
                      alt={teamMember.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-4xl font-bold">
                      {teamMember.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Display and configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Status</h3>
                <Badge className={getStatusColor(teamMember.status)}>
                  {teamMember.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Display Order</h3>
                <p className="text-sm">{teamMember.order}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Featured</h3>
                <Badge variant={teamMember.featured ? "default" : "secondary"}>
                  {teamMember.featured ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {new Date(teamMember.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(teamMember.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}