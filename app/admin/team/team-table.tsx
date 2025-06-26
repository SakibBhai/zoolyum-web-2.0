'use client';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { toast } from 'sonner';
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
  statusDisplay: string;
}

interface TeamTableProps {
  teamMembers: TeamMember[];
}

function ActionsCell({ teamMember }: { teamMember: TeamMember }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this team member?')) {
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
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/team/${teamMember.id}`}>
        <Button variant="ghost" size="sm" title="View">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/team/${teamMember.id}/edit`}>
        <Button variant="ghost" size="sm" title="Edit">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete}
        title="Delete"
        className="text-destructive hover:text-destructive"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TeamTable({ teamMembers }: TeamTableProps) {
  const columns = useMemo(() => [
    {
      header: 'Member',
      accessorKey: 'name',
      cell: ({ row }: any) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-bold flex items-center gap-2">
                {member.name}
                {member.featured && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </div>
              {member.designation && (
                <div className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md inline-block mt-1">
                  {member.designation}
                </div>
              )}
              {member.position && (
                <div className="text-sm text-muted-foreground mt-1">{member.position}</div>
              )}
              {member.bio && (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{member.bio}</div>
              )}
              {member.websiteTag && (
                <div className="text-xs italic text-gray-500 mt-1">{member.websiteTag}</div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
            {status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </Badge>
        );
      }
    },
    {
      header: 'Order',
      accessorKey: 'order',
      cell: ({ row }: any) => (
        <span className="text-sm text-muted-foreground">{row.original.order}</span>
      )
    },
    {
      header: 'Updated',
      accessorKey: 'updatedAt',
      cell: ({ row }: any) => {
        const date = new Date(row.original.updatedAt);
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      }
    },
    { 
      header: 'Actions', 
      accessorKey: 'id',
      cell: ({ row }: any) => <ActionsCell teamMember={row.original} />
    },
  ], []);

  return (
    <DataTable
      data={teamMembers}
      columns={columns}
    />
  );
}