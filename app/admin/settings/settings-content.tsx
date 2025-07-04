"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/image-uploader";

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
});

const socialLinksSchema = z.object({
  twitter: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

const appearanceSchema = z.object({
  primaryColor: z.string(),
  darkMode: z.boolean(),
});

const seoSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.array(z.string()).optional(),
});

type GeneralSettings = z.infer<typeof generalSettingsSchema>;
type SocialLinks = z.infer<typeof socialLinksSchema>;
type Appearance = z.infer<typeof appearanceSchema>;
type SEOSettings = z.infer<typeof seoSchema>;

interface SettingsContentProps {
  initialSettings: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone?: string;
    address?: string;
    socialLinks: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
    appearance: {
      primaryColor: string;
      darkMode: boolean;
    };
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
  } | null;
}

export function SettingsContent({ initialSettings }: SettingsContentProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("general");

  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: initialSettings?.siteName || "",
      siteDescription: initialSettings?.siteDescription || "",
      contactEmail: initialSettings?.contactEmail || "",
      contactPhone: initialSettings?.contactPhone || "",
      address: initialSettings?.address || "",
      logo: "",
    },
  });

  const socialForm = useForm<SocialLinks>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      twitter: initialSettings?.socialLinks.twitter || "",
      facebook: initialSettings?.socialLinks.facebook || "",
      instagram: initialSettings?.socialLinks.instagram || "",
      linkedin: initialSettings?.socialLinks.linkedin || "",
    },
  });

  const appearanceForm = useForm<Appearance>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      primaryColor: initialSettings?.appearance.primaryColor || "#FF5001",
      darkMode: initialSettings?.appearance.darkMode || false,
    },
  });

  const seoForm = useForm<SEOSettings>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: initialSettings?.seo.metaTitle || "",
      metaDescription: initialSettings?.seo.metaDescription || "",
      keywords: initialSettings?.seo.keywords || [],
    },
  });

  const onSubmitGeneral = (values: GeneralSettings) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "general",
            data: values,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save settings");
        }

        toast.success("General settings saved successfully");
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings");
      }
    });
  };

  const onSubmitSocial = (values: SocialLinks) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "social",
            data: values,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save social links");
        }

        toast.success("Social links saved successfully");
      } catch (error) {
        console.error("Error saving social links:", error);
        toast.error("Failed to save social links");
      }
    });
  };

  const onSubmitAppearance = (values: Appearance) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "appearance",
            data: values,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save appearance settings");
        }

        toast.success("Appearance settings saved successfully");
      } catch (error) {
        console.error("Error saving appearance settings:", error);
        toast.error("Failed to save appearance settings");
      }
    });
  };

  const onSubmitSEO = (values: SEOSettings) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "seo",
            data: values,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save SEO settings");
        }

        toast.success("SEO settings saved successfully");
      } catch (error) {
        console.error("Error saving SEO settings:", error);
        toast.error("Failed to save SEO settings");
      }
    });
  };

  if (!initialSettings) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Failed to load settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic information about your site</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form
                onSubmit={generalForm.handleSubmit(onSubmitGeneral)}
                className="space-y-6"
              >
                <FormField
                  control={generalForm.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your site name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generalForm.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description of your site"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generalForm.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generalForm.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your business address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Logo
                  </label>
                  <ImageUploader
                    label="Site Logo"
                    onImageChangeAction={(url) =>
                      generalForm.setValue("logo", url || "")
                    }
                    folder="settings"
                    helpText="Upload your site logo (recommended: 200x60px)"
                  />
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save General Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Manage your social media presence</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...socialForm}>
              <form
                onSubmit={socialForm.handleSubmit(onSubmitSocial)}
                className="space-y-6"
              >
                <FormField
                  control={socialForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/yourhandle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/yourpage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/yourhandle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/yourcompany"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Social Links
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...appearanceForm}>
              <form
                onSubmit={appearanceForm.handleSubmit(onSubmitAppearance)}
                className="space-y-6"
              >
                <FormField
                  control={appearanceForm.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            className="w-16 h-10"
                            {...field}
                          />
                          <Input placeholder="#FF5001" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Choose the primary color for your brand
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={appearanceForm.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Dark Mode</FormLabel>
                        <FormDescription>
                          Enable dark mode by default
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Appearance
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your site for search engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...seoForm}>
              <form
                onSubmit={seoForm.handleSubmit(onSubmitSEO)}
                className="space-y-6"
              >
                <FormField
                  control={seoForm.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Site Name - Tagline"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The title that appears in search results and browser
                        tabs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={seoForm.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of your site for search engines"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Keep it under 160 characters for best results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save SEO Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
