import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

async function deleteCampaign(id: string) {
  'use server'
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaigns/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }
    revalidatePath('/admin/campaigns');
  } catch (error) {
    console.error('Error deleting campaign:', error);
  }
}

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaigns`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Campaigns</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Manage your marketing campaigns</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#333333]">
              <th className="p-4 text-[#E9E7E2]">Title</th>
              <th className="p-4 text-[#E9E7E2]">Status</th>
              <th className="p-4 text-[#E9E7E2]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-[#333333]">
                <td className="p-4 text-[#E9E7E2]">{campaign.title}</td>
                <td className="p-4 text-[#E9E7E2]">{campaign.status}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/campaigns/${campaign.slug}`} target="_blank">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <form action={async () => { await deleteCampaign(campaign.id) }}>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
