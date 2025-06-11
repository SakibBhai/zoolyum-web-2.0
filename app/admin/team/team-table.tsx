'use client';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  imageUrl: string | null;
  status: string;
  order: number;
  updatedAt: string;
  statusDisplay: string;
}

interface TeamTableProps {
  teamMembers: TeamMember[];
}

function ActionsCell({ teamMember }: { teamMember: any }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/team/${teamMember.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/team/${teamMember.id}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="sm">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TeamTable({ teamMembers }: TeamTableProps) {
  const columns = useMemo(() => [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Position', accessorKey: 'position' },
    { header: 'Status', accessorKey: 'statusDisplay' },
    { header: 'Order', accessorKey: 'order' },
    { header: 'Updated', accessorKey: 'updatedAt' },
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