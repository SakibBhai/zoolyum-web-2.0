import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  content?: string;
  status: string;
}

async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaigns/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch campaign');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">
            {campaign.title}
          </h1>
          <p className="text-[#E9E7E2]/60 mt-1">{campaign.shortDescription}</p>
        </div>
        <Link href={`/admin/campaigns/${campaign.id}/edit`}>
          <Button>Edit Campaign</Button>
        </Link>
      </div>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: campaign.content || "" }}
      />
    </div>
  );
}
