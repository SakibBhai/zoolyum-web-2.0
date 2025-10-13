import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, Calendar, User, Mail, Phone, Building, MessageSquare, DollarSign } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface CampaignSubmission {
  id: string;
  campaignId: string;
  data: {
    fullName?: string;
    email?: string;
    phone?: string;
    company?: string;
    budget?: string;
    services?: string;
    message?: string;
    [key: string]: any;
  };
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
  campaign: {
    id: string;
    title: string;
    slug: string;
  };
}

async function getSubmissions(): Promise<CampaignSubmission[]> {
  try {
    const submissions = await prisma.campaignSubmission.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Convert Date objects to strings for serialization
    return submissions.map(submission => ({
      ...submission,
      submittedAt: submission.submittedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error('Failed to fetch submissions');
  }
}

async function getCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
}

export default async function CampaignSubmissionsPage() {
  const submissions = await getSubmissions();
  const campaigns = await getCampaigns();

  const pagination = {
    page: 1,
    limit: 10,
    total: submissions.length,
    pages: Math.ceil(submissions.length / 10),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Campaign Submissions</h1>
          <p className="text-[#E9E7E2]/60 mt-1">View and manage campaign form submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search submissions..."
            className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]">
            <SelectValue placeholder="Filter by campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardContent className="p-8 text-center">
              <p className="text-[#E9E7E2]/60">No submissions found</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#E9E7E2] text-lg">
                    {submission.data.fullName || 'Anonymous'}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-[#FF5001]/20 text-[#FF5001]">
                    {submission.campaign.title}
                  </Badge>
                </div>
                <p className="text-[#E9E7E2]/60 text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submission.data.email && (
                    <div className="flex items-center text-[#E9E7E2]">
                      <Mail className="h-4 w-4 mr-2 text-[#FF5001]" />
                      <span className="text-sm">{submission.data.email}</span>
                    </div>
                  )}
                  {submission.data.phone && (
                    <div className="flex items-center text-[#E9E7E2]">
                      <Phone className="h-4 w-4 mr-2 text-[#FF5001]" />
                      <span className="text-sm">{submission.data.phone}</span>
                    </div>
                  )}
                  {submission.data.company && (
                    <div className="flex items-center text-[#E9E7E2]">
                      <Building className="h-4 w-4 mr-2 text-[#FF5001]" />
                      <span className="text-sm">{submission.data.company}</span>
                    </div>
                  )}
                  {submission.data.budget && (
                    <div className="flex items-center text-[#E9E7E2]">
                      <DollarSign className="h-4 w-4 mr-2 text-[#FF5001]" />
                      <span className="text-sm">{submission.data.budget}</span>
                    </div>
                  )}
                  {submission.data.services && (
                    <div className="flex items-center text-[#E9E7E2]">
                      <User className="h-4 w-4 mr-2 text-[#FF5001]" />
                      <span className="text-sm">{submission.data.services}</span>
                    </div>
                  )}
                </div>
                {submission.data.message && (
                  <div className="mt-4 p-3 bg-[#0A0A0A] rounded-lg">
                    <div className="flex items-start text-[#E9E7E2]">
                      <MessageSquare className="h-4 w-4 mr-2 text-[#FF5001] mt-0.5" />
                      <p className="text-sm">{submission.data.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 p-4 bg-[#1A1A1A] border border-[#333333] rounded-lg">
        <p className="text-[#E9E7E2]/60 text-sm">
          Total submissions: <span className="text-[#FF5001] font-medium">{submissions.length}</span>
        </p>
      </div>
    </div>
  );
}