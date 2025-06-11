import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash, Mail, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface TeamMemberPageProps {
  params: {
    id: string;
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });

  if (!teamMember) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/team">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />

            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{teamMember.name}</h1>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/admin/team/${teamMember.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMember.imageUrl && (
              <div className="flex justify-center">
                <Image
                  src={teamMember.imageUrl}
                  alt={teamMember.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{teamMember.name}</h2>
              {teamMember.position && (
                <p className="text-muted-foreground">{teamMember.position}</p>
              )}
              <Badge variant={teamMember.status === 'published' ? 'default' : 'secondary'}>
                {teamMember.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            </div>

            <div className="flex justify-center gap-2">
              {teamMember.email && (
                <Link href={`mailto:${teamMember.email}`}>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {teamMember.linkedinUrl && (
                <Link href={teamMember.linkedinUrl} target="_blank">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {teamMember.twitterUrl && (
                <Link href={teamMember.twitterUrl} target="_blank">
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {teamMember.bio && (
              <div>
                <h3 className="font-semibold mb-2">Biography</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{teamMember.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Display Order</h3>
                <p className="text-muted-foreground">{teamMember.order}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Status</h3>
                <Badge variant={teamMember.status === 'published' ? 'default' : 'secondary'}>
                  {teamMember.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Created</h3>
                <p className="text-muted-foreground">
                  {new Date(teamMember.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Last Updated</h3>
                <p className="text-muted-foreground">
                  {new Date(teamMember.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}