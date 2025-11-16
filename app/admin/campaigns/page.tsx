import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Image as ImageIcon, Video } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CampaignMediaPreview } from '@/components/admin/campaign-media-preview'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  imageUrls: string[];
  videoUrls: string[];
}

async function deleteCampaign(id: string) {
  'use server'
  
  try {
    await prisma.campaign.delete({
      where: {
        id: id
      }
    });
    
    // Revalidate the campaigns page to reflect the deletion
    revalidatePath('/admin/campaigns');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw new Error('Failed to delete campaign');
  }
}

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        imageUrls: true,
        videoUrls: true,
      },
    });
    
    // Convert Date objects to strings for serialization
    return campaigns.map(campaign => ({
      ...campaign,
      createdAt: campaign.createdAt.toISOString(),
      imageUrls: campaign.imageUrls || [],
      videoUrls: campaign.videoUrls || [],
    }));
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    // Return empty array instead of throwing to prevent 404
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
              <th className="p-4 text-[#E9E7E2]">Campaign</th>
              <th className="p-4 text-[#E9E7E2]">Media</th>
              <th className="p-4 text-[#E9E7E2]">Status</th>
              <th className="p-4 text-[#E9E7E2]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-[#333333]">
                <td className="p-4">
                  <div>
                    <h3 className="text-[#E9E7E2] font-medium">{campaign.title}</h3>
                    <p className="text-[#E9E7E2]/60 text-sm">/{campaign.slug}</p>
                  </div>
                </td>
                <td className="p-4">
                  <CampaignMediaPreview 
                    imageUrls={campaign.imageUrls} 
                    videoUrls={campaign.videoUrls} 
                  />
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'PUBLISHED' 
                      ? 'bg-green-900/20 text-green-400' 
                      : campaign.status === 'DRAFT'
                      ? 'bg-yellow-900/20 text-yellow-400'
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <Link href={`/campaigns/${campaign.slug}`} target="_blank">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <form action={deleteCampaign.bind(null, campaign.id)}>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-[#E9E7E2]/40" />
            <h3 className="text-lg font-medium text-[#E9E7E2] mb-2">No campaigns yet</h3>
            <p className="text-[#E9E7E2]/60 mb-4">Get started by creating your first campaign</p>
            <Link href="/admin/campaigns/new">
              <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
