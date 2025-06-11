import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TeamTable } from './team-table';

export default async function TeamMembersPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      position: true,
      imageUrl: true,
      status: true,
      order: true,
      updatedAt: true,
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Link href="/admin/team/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </Link>
      </div>
      
      <TeamTable
        teamMembers={teamMembers.map(member => ({
          ...member,
          updatedAt: new Date(member.updatedAt).toLocaleDateString(),
          statusDisplay: member.status === 'published' ? 'Published' : 'Draft'
        }))}
      />
    </div>
  );
}