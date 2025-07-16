import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// Force dynamic rendering to avoid build-time database calls
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

async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaigns/${slug}`, {
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

async function CampaignData({ slug }: { slug: string }) {
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound()
  }

  // Only show published campaigns to public
  if (campaign.status !== 'PUBLISHED') {
    notFound()
  }

  return (
    <div className="prose prose-invert mx-auto py-12">
      <h1>{campaign.title}</h1>
      <p>{campaign.shortDescription}</p>
      <div dangerouslySetInnerHTML={{ __html: campaign.content || campaign.description || '' }} />
      {/* Render other campaign details as needed */}
    </div>
  )
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignData slug={slug} />
    </Suspense>
  )
}
