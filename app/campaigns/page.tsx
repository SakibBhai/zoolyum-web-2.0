import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { startDate: 'desc' },
  })

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign) => (
          <Link key={campaign.id} href={`/campaigns/${campaign.slug}`}>
            <a className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
              <p className="text-gray-400">{campaign.shortDescription}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
