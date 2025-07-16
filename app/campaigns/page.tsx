import Link from 'next/link'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  startDate: string;
}

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaigns?status=PUBLISHED`, {
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
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Campaigns</h1>
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No campaigns available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaigns/${campaign.slug}`} className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
              <p className="text-gray-400">{campaign.shortDescription}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
