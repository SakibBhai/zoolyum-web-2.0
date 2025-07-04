import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CampaignDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
  });

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
