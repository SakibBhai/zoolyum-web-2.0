import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditTeamMemberPageProps {
  params: {
    id: string;
  };
}

async function updateTeamMember(id: string, formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const position = formData.get('position') as string;
  const bio = formData.get('bio') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const linkedinUrl = formData.get('linkedinUrl') as string;
  const twitterUrl = formData.get('twitterUrl') as string;
  const email = formData.get('email') as string;
  const status = formData.get('status') as string;
  const order = parseInt(formData.get('order') as string) || 0;

  await prisma.teamMember.update({
    where: { id },
    data: {
      name,
      position: position || null,
      bio: bio || null,
      imageUrl: imageUrl || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      email: email || null,
      status: status || 'draft',
      order,
    },
  });

  redirect(`/admin/team/${id}`);
}

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });

  if (!teamMember) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/team/${teamMember.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit {teamMember.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateTeamMember.bind(null, teamMember.id)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" defaultValue={teamMember.name} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  name="position" 
                  defaultValue={teamMember.position || ''} 
                  placeholder="e.g., CEO, Developer" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                rows={4} 
                defaultValue={teamMember.bio || ''} 
                placeholder="Short biography..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Photo URL</Label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                type="url" 
                defaultValue={teamMember.imageUrl || ''} 
                placeholder="https://..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  defaultValue={teamMember.email || ''} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input 
                  id="linkedinUrl" 
                  name="linkedinUrl" 
                  type="url" 
                  defaultValue={teamMember.linkedinUrl || ''} 
                  placeholder="https://linkedin.com/in/..." 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input 
                  id="twitterUrl" 
                  name="twitterUrl" 
                  type="url" 
                  defaultValue={teamMember.twitterUrl || ''} 
                  placeholder="https://twitter.com/..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={teamMember.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input 
                  id="order" 
                  name="order" 
                  type="number" 
                  defaultValue={teamMember.order.toString()} 
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Update Team Member</Button>
              <Link href={`/admin/team/${teamMember.id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}