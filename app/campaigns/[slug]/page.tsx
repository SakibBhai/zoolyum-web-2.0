import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { CampaignForm } from '@/components/campaign-form'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
}

interface CTA {
  label: string;
  url: string;
}

interface Campaign {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content?: string;
  status: string;
  imageUrls: string[];
  videoUrls: string[];
  enableForm: boolean;
  formFields: FormField[];
  ctas: CTA[];
  successMessage?: string;
  redirectUrl?: string;
}

async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/campaigns/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function CampaignData({ campaign }: { campaign: Campaign }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">{campaign.title}</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{campaign.shortDescription}</p>
            
            {/* CTAs */}
            {campaign.ctas && campaign.ctas.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {campaign.ctas.map((cta, index) => (
                  <Button 
                    key={index}
                    asChild
                    size="lg"
                    className={index === 0 ? "" : "variant-outline"}
                  >
                    <a href={cta.url} target="_blank" rel="noopener noreferrer">
                      {cta.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Section */}
      {((campaign.imageUrls && campaign.imageUrls.length > 0) || (campaign.videoUrls && campaign.videoUrls.length > 0)) && (
        <div className="py-16">
          <div className="container mx-auto px-4">
            {/* Videos */}
            {campaign.videoUrls && campaign.videoUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.videoUrls.map((videoUrl, index) => {
                    const videoId = getYouTubeVideoId(videoUrl);
                    return (
                      <div key={index} className="aspect-video">
                        {videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`Video ${index + 1}`}
                            className="w-full h-full rounded-lg shadow-lg"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Invalid video URL</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Images */}
            {campaign.imageUrls && campaign.imageUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.imageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={imageUrl}
                        alt={`Campaign image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      {campaign.content && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Section */}
      {campaign.enableForm && campaign.formFields && campaign.formFields.length > 0 && (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-600">Get in touch with us for more information</p>
            </div>
            <CampaignForm
              campaignId={campaign.id}
              fields={campaign.formFields}
              successMessage={campaign.successMessage}
              redirectUrl={campaign.redirectUrl}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  // Only show published campaigns to public
  if (campaign.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignData campaign={campaign} />
    </Suspense>
  )
}
