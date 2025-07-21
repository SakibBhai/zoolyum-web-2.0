"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { CampaignFormBuilder, FormField } from "@/components/admin/campaign-form-builder";
import { CampaignMediaUploader } from "@/components/admin/campaign-media-uploader";
import { createCampaign } from "@/lib/campaign-operations";

interface CTA {
  label: string;
  url: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
    imageUrls: [] as string[],
    videoUrls: [] as string[],
    enableForm: false,
    successMessage: "Thank you for your submission!",
    redirectUrl: "",
  });

  const [ctas, setCtas] = useState<CTA[]>([{ label: "", url: "" }]);
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "field_name",
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name"
    },
    {
      id: "field_email",
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "Enter your email address"
    },
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleMediaChange = (imageUrls: string[], videoUrls: string[]) => {
    setFormData({
      ...formData,
      imageUrls,
      videoUrls,
    });
  };

  const handleCTAChange = (index: number, field: keyof CTA, value: string) => {
    const newCTAs = [...ctas];
    newCTAs[index] = { ...newCTAs[index], [field]: value };
    setCtas(newCTAs);
  };

  const addCTA = () => {
    setCtas([...ctas, { label: "", url: "" }]);
  };

  const removeCTA = (index: number) => {
    if (ctas.length > 1) {
      setCtas(ctas.filter((_, i) => i !== index));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createCampaign({
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        content: formData.content,
        status: formData.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== ""),
        videoUrls: formData.videoUrls.filter(url => url.trim() !== ""),
        enableForm: formData.enableForm,
        formFields: formData.enableForm ? formFields.map(field => ({
          ...field,
          type: field.type === 'tel' ? 'phone' : field.type
        })) : [],
        ctas: ctas.filter(cta => cta.label.trim() !== "" && cta.url.trim() !== ""),
        successMessage: formData.successMessage,
        redirectUrl: formData.redirectUrl,
      });

      if (result.success) {
        router.push("/admin/campaigns");
      } else {
        console.error("Failed to create campaign:", result.error);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">
            Create New Campaign
          </h1>
          <p className="text-[#E9E7E2]/60 mt-1">
            Design and launch your marketing campaign
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Set up the basic details for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter campaign title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="campaign-url-slug"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                placeholder="Brief description of the campaign"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Campaign Content</Label>
              <RichTextEditor
                value={formData.content}
                onContentChange={(value: string) =>
                  setFormData({ ...formData, content: value })
                }
                placeholder="Write your campaign content here..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Media</CardTitle>
            <CardDescription>
              Upload images and add YouTube videos for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignMediaUploader
              images={formData.imageUrls}
              videoUrls={formData.videoUrls}
              onChange={handleMediaChange}
            />
          </CardContent>
        </Card>

        {/* Call-to-Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Buttons</CardTitle>
            <CardDescription>
              Add buttons to drive user engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ctas.map((cta, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`cta-label-${index}`}>Button Label</Label>
                  <Input
                    id={`cta-label-${index}`}
                    value={cta.label}
                    onChange={(e) =>
                      handleCTAChange(index, "label", e.target.value)
                    }
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`cta-url-${index}`}>Button URL</Label>
                  <Input
                    id={`cta-url-${index}`}
                    value={cta.url}
                    onChange={(e) =>
                      handleCTAChange(index, "url", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeCTA(index)}
                  disabled={ctas.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCTA}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add CTA Button
            </Button>
          </CardContent>
        </Card>

        {/* Form Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lead Capture Form</CardTitle>
                <CardDescription>
                  Collect user information with a custom form
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="enable-form">Enable Form</Label>
                <Switch
                  id="enable-form"
                  checked={formData.enableForm}
                  onCheckedChange={(checked) =>
                    handleInputChange("enableForm", checked)
                  }
                />
              </div>
            </div>
          </CardHeader>
          {formData.enableForm && (
            <CardContent className="space-y-4">
              <CampaignFormBuilder
                fields={formFields}
                onChange={setFormFields}
              />
              <Separator />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="successMessage">Success Message</Label>
                  <Textarea
                    id="successMessage"
                    value={formData.successMessage}
                    onChange={(e) =>
                      handleInputChange("successMessage", e.target.value)
                    }
                    placeholder="Thank you for your submission!"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
                  <Input
                    id="redirectUrl"
                    value={formData.redirectUrl}
                    onChange={(e) =>
                      handleInputChange("redirectUrl", e.target.value)
                    }
                    placeholder="https://example.com/thank-you"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Scheduling & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduling & Status</CardTitle>
            <CardDescription>
              Configure when your campaign should be active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/campaigns")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}
