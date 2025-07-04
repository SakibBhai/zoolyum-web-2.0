"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/team/${teamMember.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete team member");
        }

        toast.success("Team member deleted successfully");
        router.refresh();
      } catch (error) {
        console.error("Error deleting team member:", error);
        toast.error("Failed to delete team member");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/team/${teamMember.id}/view`}>
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
        disabled={isPending}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TeamTable({ teamMembers }: TeamTableProps) {
  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        header: "Member",
        accessorKey: "name",
        cell: ({ row }) => {
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
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">
                  {member.position || member.designation || "No position"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const member = row.original;
          const statusVariant =
            member.status === "active"
              ? "default"
              : member.status === "inactive"
              ? "secondary"
              : "outline";

          return <Badge variant={statusVariant}>{member.statusDisplay}</Badge>;
        },
      },
      {
        header: "Featured",
        accessorKey: "featured",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-2">
              {member.featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {member.featured ? "Yes" : "No"}
              </span>
            </div>
          );
        },
      },
      {
        header: "Contact",
        accessorKey: "email",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="text-sm">
              {member.email && (
                <div className="text-blue-600 hover:text-blue-800">
                  {member.email}
                </div>
              )}
              {member.linkedin && (
                <div className="text-blue-600 hover:text-blue-800">
                  LinkedIn
                </div>
              )}
              {member.twitter && (
                <div className="text-blue-600 hover:text-blue-800">Twitter</div>
              )}
            </div>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => <ActionsCell teamMember={row.original} />,
      },
    ],
    []
  );

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={teamMembers} />
    </div>
  );
}
