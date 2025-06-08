import Link from 'next/link';
import { prisma } from '@/lib/db';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';

export default async function TeamMembersPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      role: true,
      imageUrl: true,
      active: true,
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
      
      <DataTable
        data={teamMembers.map(member => ({
          ...member,
          updatedAt: new Date(member.updatedAt).toLocaleDateString(),
          status: member.active ? 'Active' : 'Inactive',
          actions: member.id
        }))}
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Role', accessorKey: 'role' },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Order', accessorKey: 'order' },
          { header: 'Updated', accessorKey: 'updatedAt' },
          { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: ({ row }) => {
              const id = row.original.id;
              return (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/team/${id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/team/${id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/team/${id}/delete`}>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              );
            }
          }
        ]}
      />
    </div>
  );
}