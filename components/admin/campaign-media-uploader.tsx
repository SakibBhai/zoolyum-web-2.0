"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaItem {
  id: string;
  type: "image" | "youtube";
  url: string;
  title?: string;
  thumbnail?: string;
}

interface CampaignMediaUploaderProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
  className?: string;
}

export function CampaignMediaUploader({
  images = [],
  videos = [],
  onImagesChange,
  onVideosChange,
  className,
}: CampaignMediaUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Ensure arrays are always defined
  const safeImages = images || [];
  const safeVideos = videos || [];

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeId(url) !== null;
  };

  // Add image URL
  const addImageUrl = useCallback(() => {
    if (newImageUrl.trim() && !safeImages.includes(newImageUrl.trim())) {
      onImagesChange([...safeImages, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  }, [newImageUrl, safeImages, onImagesChange]);

  // Add video URL
  const addVideoUrl = useCallback(() => {
    if (newVideoUrl.trim() && isValidYouTubeUrl(newVideoUrl.trim()) && !safeVideos.includes(newVideoUrl.trim())) {
      onVideosChange([...safeVideos, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  }, [newVideoUrl, safeVideos, onVideosChange]);

  // Remove image
  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = safeImages.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    },
    [safeImages, onImagesChange]
  );

  // Remove video
  const removeVideo = useCallback(
    (index: number) => {
      const updatedVideos = safeVideos.filter((_, i) => i !== index);
      onVideosChange(updatedVideos);
    },
    [safeVideos, onVideosChange]
  );

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "campaign");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.url) {
        onImagesChange([...safeImages, data.url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Images Section */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-[#E9E7E2] flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Campaign Images
          </CardTitle>
          <CardDescription className="text-[#E9E7E2]/60">
            Upload or add image URLs for your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#E9E7E2]">Upload Image</Label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <Label
                  htmlFor="image-upload"
                  className={cn(
                    "flex items-center justify-center w-full h-32 border-2 border-dashed border-[#333333] rounded-lg cursor-pointer hover:border-[#FF5001] transition-colors",
                    uploadingImage && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-[#E9E7E2]/60 mx-auto mb-2" />
                    <p className="text-sm text-[#E9E7E2]/60">
                      {uploadingImage ? "Uploading..." : "Click to upload"}
                    </p>
                    <p className="text-xs text-[#E9E7E2]/40">PNG, JPG up to 5MB</p>
                  </div>
                </Label>
              </div>
            </div>

            <div>
              <Label className="text-[#E9E7E2]">Or Add Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  onKeyPress={(e) => e.key === "Enter" && addImageUrl()}
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  disabled={!newImageUrl.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {safeImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {safeImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group bg-[#252525] border border-[#333333] rounded-lg overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={imageUrl}
                      alt={`Campaign image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(imageUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {safeImages.length === 0 && (
            <div className="text-center py-8 text-[#E9E7E2]/60">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No images added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-[#E9E7E2] flex items-center gap-2">
            <Video className="h-5 w-5" />
            YouTube Videos
          </CardTitle>
          <CardDescription className="text-[#E9E7E2]/60">
            Add YouTube video URLs to embed in your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Video URL */}
          <div>
            <Label className="text-[#E9E7E2]">YouTube Video URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                onKeyPress={(e) => e.key === "Enter" && addVideoUrl()}
              />
              <Button
                type="button"
                onClick={addVideoUrl}
                disabled={!newVideoUrl.trim() || !isValidYouTubeUrl(newVideoUrl.trim())}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {newVideoUrl.trim() && !isValidYouTubeUrl(newVideoUrl.trim()) && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid YouTube URL
              </p>
            )}
          </div>

          {/* Videos Grid */}
          {safeVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeVideos.map((videoUrl, index) => {
                const videoId = extractYouTubeId(videoUrl);
                const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;

                return (
                  <div
                    key={index}
                    className="relative group bg-[#252525] border border-[#333333] rounded-lg overflow-hidden"
                  >
                    <div className="aspect-video relative">
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt={`YouTube video ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                          <Video className="h-12 w-12 text-[#E9E7E2]/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(videoUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeVideo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        Video {index + 1}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {safeVideos.length === 0 && (
            <div className="text-center py-8 text-[#E9E7E2]/60">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}