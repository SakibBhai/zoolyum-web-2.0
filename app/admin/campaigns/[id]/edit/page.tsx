"use client";

import { useState, useEffect } from "react";
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
import { updateCampaign } from "@/lib/campaign-operations";

interface CTA {
  label: string;
  url: string;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
  placeholder?: string;
}

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [ctas, setCtas] = useState<CTA[]>([{ label: "", url: "" }]);
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
  ]);
  const [campaignId, setCampaignId] = useState<string>("");

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params;
      setCampaignId(resolvedParams.id);
    }
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!campaignId) return;
    
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign');
        }
        const campaign = await response.json();
        setFormData(campaign);
        if (campaign && campaign.ctas) {
          const ctasArray = Array.isArray(campaign.ctas)
            ? (campaign.ctas as unknown as CTA[])
            : [];
          setCtas(ctasArray);
        }
        if (campaign && campaign.formFields) {
          const formFieldsArray = Array.isArray(campaign.formFields)
            ? (campaign.formFields as unknown as FormField[])
            : [];
          setFormFields(formFieldsArray);
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      }
    }
    fetchCampaign();
  }, [campaignId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "imageUrls" | "videoUrls",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: "imageUrls" | "videoUrls") => {
    setFormData((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field: "imageUrls" | "videoUrls", index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const handleCTAChange = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    const newCTAs = [...ctas];
    newCTAs[index][field] = value;
    setCtas(newCTAs);
  };

  const addCTA = () => {
    setCtas([...ctas, { label: "", url: "" }]);
  };

  const removeCTA = (index: number) => {
    setCtas(ctas.filter((_, i) => i !== index));
  };

  const handleFormFieldChange = (
    index: number,
    field: keyof FormField,
    value: any
  ) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormFields(newFields);
  };

  const addFormField = () => {
    setFormFields([
      ...formFields,
      { name: "", label: "", type: "text", required: false },
    ]);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await updateCampaign(campaignId, formData);

    setLoading(false);

    if (result?.errors) {
      console.error("Validation errors:", result.errors);
      alert(`Failed to update campaign: ${JSON.stringify(result.errors)}`);
      return;
    }

    if (result?.error) {
      console.error("Error updating campaign:", result.error);
      alert(`Failed to update campaign: ${result.error}`);
      return;
    }

    if (result?.campaign) {
      router.push(`/admin/campaigns`);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Edit Campaign</h1>
          <p className="text-[#E9E7E2]/60 mt-1">
            Update your marketing campaign
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Basic Information</CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Essential details about your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-[#E9E7E2]">
                  Campaign Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-[#E9E7E2]">
                  URL Slug *
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription" className="text-[#E9E7E2]">
                Short Description
              </Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                rows={3}
                placeholder="Brief description for meta tags and summaries"
              />
            </div>

            <div>
              <Label className="text-[#E9E7E2]">Campaign Content</Label>
              <RichTextEditor
                value={formData.content}
                onChangeAction={(value: string) =>
                  handleInputChange("content", value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">
              Scheduling & Status
            </CardTitle>
            <CardDescription className="text-[#E9E7E2]/60">
              Set campaign timeline and publication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status" className="text-[#E9E7E2]">
                  Status
                </Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="text-[#E9E7E2]">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-[#E9E7E2]">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#FF5001] hover:bg-[#FF5001]/90"
          >
            {loading ? "Updating..." : "Update Campaign"}
          </Button>
          <Link href="/admin/campaigns">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
