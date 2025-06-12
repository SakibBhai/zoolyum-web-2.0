'use client'

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash, BarChart3 } from 'lucide-react';
import { AdminLoading } from '@/components/admin/admin-loading';

// Client component for fetching campaigns data
function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <AdminLoading />;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'secondary' as const, label: 'Draft' },
      SCHEDULED: { variant: 'outline' as const, label: 'Scheduled' },
      PUBLISHED: { variant: 'default' as const, label: 'Published' },
      ARCHIVED: { variant: 'destructive' as const, label: 'Archived' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DataTable
      data={campaigns.map((campaign: any) => ({
        ...campaign,
        authorName: campaign.author?.name || 'Unknown',
        updatedAt: new Date(campaign.updatedAt).toLocaleDateString(),
        startDate: formatDate(campaign.startDate),
        endDate: formatDate(campaign.endDate),
        statusBadge: getStatusBadge(campaign.status),
        submissionCount: campaign._count?.submissions || 0,
        actions: campaign.id
      }))}
      columns={[
        { header: 'Title', accessorKey: 'title' },
        { header: 'Status', accessorKey: 'statusBadge' },
        { header: 'Start Date', accessorKey: 'startDate' },
        { header: 'End Date', accessorKey: 'endDate' },
        { header: 'Views', accessorKey: 'views' },
        { header: 'Submissions', accessorKey: 'submissionCount' },
        { header: 'Author', accessorKey: 'authorName' },
        { header: 'Updated', accessorKey: 'updatedAt' },
        { 
          header: 'Actions', 
          accessorKey: 'actions',
          cell: ({ row }) => {
            const id = row.original.id;
            return (
              <div className="flex items-center gap-2">
                <Link href={`/admin/campaigns/${id}`}>
                  <Button variant="ghost" size="icon" title="View Campaign">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/campaigns/${id}/edit`}>
                  <Button variant="ghost" size="icon" title="Edit Campaign">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/campaigns/${id}/analytics`}>
                  <Button variant="ghost" size="icon" title="View Analytics">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Delete Campaign"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this campaign?')) {
                      try {
                        await fetch(`/api/campaigns/${id}`, {
                          method: 'DELETE',
                        });
                        // Refresh the data
                        window.location.reload();
                      } catch (error) {
                        console.error('Error deleting campaign:', error);
                        alert('Failed to delete campaign');
                      }
                    }
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            );
          }
        }
      ]}
    />
  );
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Campaigns</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Manage your marketing campaigns and promotions</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>
      
      {/* Table with Suspense boundary */}
      <Suspense fallback={<AdminLoading />}>
        <CampaignsTable />
      </Suspense>
    </div>
  );
}