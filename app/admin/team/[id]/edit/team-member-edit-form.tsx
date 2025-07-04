"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/image-uploader";

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  designation: string | null;
  websiteTag: string | null;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  status: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMemberEditFormProps {
  teamMember: TeamMember;
}

export function TeamMemberEditForm({ teamMember }: TeamMemberEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: teamMember.name || "",
    position: teamMember.position || "",
    designation: teamMember.designation || "",
    websiteTag: teamMember.websiteTag || "",
    bio: teamMember.bio || "",
    imageUrl: teamMember.imageUrl || "",
    email: teamMember.email || "",
    linkedin: teamMember.linkedin || "",
    twitter: teamMember.twitter || "",
    status: teamMember.status || "ACTIVE",
    order: teamMember.order || 0,
    featured: teamMember.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch(`/api/team/${teamMember.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update team member");
        }

        toast.success("Team member updated successfully");
        router.push("/admin/team");
        router.refresh();
      } catch (error) {
        console.error("Error updating team member:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update team member"
        );
      }
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/team">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Team Member
          </h1>
          <p className="text-muted-foreground">
            Update team member information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the team member's basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      placeholder="e.g. Senior Developer"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      placeholder="e.g. Founder & Creative Director"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteTag">Website Tag</Label>
                    <Input
                      id="websiteTag"
                      value={formData.websiteTag}
                      onChange={(e) =>
                        handleInputChange("websiteTag", e.target.value)
                      }
                      placeholder="e.g. @vibestudio.com"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Brief description about the team member"
                    rows={4}
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Optional contact and social media links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        handleInputChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/username"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
                <CardDescription>Upload a profile photo</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  label="Profile Image"
                  initialImageUrl={formData.imageUrl}
                  onImageChangeAction={(url) =>
                    handleInputChange("imageUrl", url || "")
                  }
                  folder="team"
                  helpText="Upload a square profile image (1:1 aspect ratio recommended). Accepted formats: JPG, PNG, WebP."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure display options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    min="0"
                    disabled={isPending}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                    disabled={isPending}
                  />
                  <Label htmlFor="featured">Featured Member</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Link href="/admin/team">
            <Button variant="outline" type="button" disabled={isPending}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
