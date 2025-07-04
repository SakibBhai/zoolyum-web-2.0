import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

async function CampaignData({ slug }: { slug: string }) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  })

  if (!campaign) {
    notFound()
  }

  return (
    <div className="prose prose-invert mx-auto py-12">
      <h1>{campaign.title}</h1>
      <p>{campaign.shortDescription}</p>
      <div dangerouslySetInnerHTML={{ __html: campaign.content || '' }} />
      {/* Render other campaign details as needed */}
    </div>
  )
}

export default function CampaignPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignData slug={params.slug} />
    </Suspense>
  )
}
