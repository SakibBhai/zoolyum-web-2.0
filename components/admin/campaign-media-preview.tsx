"use client";

import { useState } from 'react';
import { Video, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CampaignMediaPreviewProps {
  imageUrls: string[];
  videoUrls: string[];
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function CampaignMediaPreview({ imageUrls, videoUrls }: CampaignMediaPreviewProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleVideoError = (index: number) => {
    setVideoErrors(prev => new Set(prev).add(index));
  };

  return (
    <div className="flex items-center gap-2">
      {/* Image Preview */}
      {imageUrls.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="relative w-8 h-8 rounded overflow-hidden bg-[#333333]">
            {imageErrors.has(0) ? (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-[#E9E7E2]/60" />
              </div>
            ) : (
              <Image
                src={imageUrls[0]}
                alt="Campaign image"
                fill
                className="object-cover"
                onError={() => handleImageError(0)}
              />
            )}
          </div>
          {imageUrls.length > 1 && (
            <span className="text-xs text-[#E9E7E2]/60">
              +{imageUrls.length - 1}
            </span>
          )}
        </div>
      )}
      
      {/* Video Preview */}
      {videoUrls.length > 0 && (
        <div className="flex items-center gap-1">
          {(() => {
            const videoId = extractYouTubeId(videoUrls[0]);
            const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;
            
            return (
              <div className="relative w-8 h-8 rounded overflow-hidden bg-[#333333]">
                {thumbnailUrl && !videoErrors.has(0) ? (
                  <Image
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                    onError={() => handleVideoError(0)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-4 w-4 text-[#E9E7E2]/60" />
                  </div>
                )}
              </div>
            );
          })()}
          {videoUrls.length > 1 && (
            <span className="text-xs text-[#E9E7E2]/60">
              +{videoUrls.length - 1}
            </span>
          )}
        </div>
      )}
      
      {/* No Media */}
      {imageUrls.length === 0 && videoUrls.length === 0 && (
        <div className="flex items-center gap-1 text-[#E9E7E2]/40">
          <ImageIcon className="h-4 w-4" />
          <span className="text-xs">No media</span>
        </div>
      )}
    </div>
  );
}