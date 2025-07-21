'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Settings, Globe, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  seoSettings: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
  };
}

interface NavigationItem {
  id?: string;
  label: string;
  url: string;
  type: string;
  order: number;
  isVisible: boolean;
  parentId?: string;
}

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    contactPhone: '',
    socialMedia: {},
    seoSettings: {}
  });

  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, navRes] = await Promise.all([
        fetch('/api/site/settings'),
        fetch('/api/site/navigation')
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      if (navRes.ok) {
        const navData = await navRes.json();
        setNavigation(Array.isArray(navData) ? navData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/site/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Site settings updated successfully');
      } else {
        toast.error('Failed to update site settings');
      }
    } catch (error) {
      toast.error('Error updating site settings');
    }
  };

  const saveNavigation = async () => {
    try {
      const response = await fetch('/api/site/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItems: navigation })
      });

      if (response.ok) {
        toast.success('Navigation updated successfully');
      } else {
        toast.error('Failed to update navigation');
      }
    } catch (error) {
      toast.error('Error updating navigation');
    }
  };

  const addNavigationItem = () => {
    setNavigation([...navigation, {
      label: '',
      url: '',
      type: 'internal',
      order: navigation.length,
      isVisible: true
    }]);
  };

  const removeNavigationItem = (index: number) => {
    setNavigation(navigation.filter((_, i) => i !== index));
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [platform]: value
      }
    });
  };

  const updateSeoSettings = (field: string, value: string) => {
    setSettings({
      ...settings,
      seoSettings: {
        ...settings.seoSettings,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading site settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Site Settings Manager</h1>
        <Badge variant="outline">Global Configuration</Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4 mr-2" />
            Social & SEO
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Navigation className="h-4 w-4 mr-2" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Site Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Zoolyum"
                  />
                </div>
                <div>
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    placeholder="https://zoolyum.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Brand Strategy & Digital Innovation Agency"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <Input
                    id="favicon-url"
                    value={settings.faviconUrl}
                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
              <Button onClick={saveSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia.facebook || ''}
                      onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                      placeholder="https://facebook.com/zoolyum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialMedia.twitter || ''}
                      onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                      placeholder="https://twitter.com/zoolyum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.socialMedia.linkedin || ''}
                      onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/zoolyum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia.instagram || ''}
                      onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                      placeholder="https://instagram.com/zoolyum"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={settings.seoSettings.metaTitle || ''}
                    onChange={(e) => updateSeoSettings('metaTitle', e.target.value)}
                    placeholder="Zoolyum | Brand Strategy & Digital Innovation Agency"
                  />
                </div>
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={settings.seoSettings.metaDescription || ''}
                    onChange={(e) => updateSeoSettings('metaDescription', e.target.value)}
                    placeholder="Transform your business with strategic brand development..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Input
                    id="meta-keywords"
                    value={settings.seoSettings.metaKeywords || ''}
                    onChange={(e) => updateSeoSettings('metaKeywords', e.target.value)}
                    placeholder="brand strategy, digital innovation, marketing agency"
                  />
                </div>
                <div>
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <Input
                    id="og-image"
                    value={settings.seoSettings.ogImage || ''}
                    onChange={(e) => updateSeoSettings('ogImage', e.target.value)}
                    placeholder="/og-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Social & SEO Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Navigation Menu
                <Button onClick={addNavigationItem} size="sm">
                  Add Menu Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {navigation.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newNav = [...navigation];
                        newNav[index].label = e.target.value;
                        setNavigation(newNav);
                      }}
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newNav = [...navigation];
                        newNav[index].url = e.target.value;
                        setNavigation(newNav);
                      }}
                      placeholder="/"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const newNav = [...navigation];
                        newNav[index].type = e.target.value;
                        setNavigation(newNav);
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option value="internal">Internal</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={item.order}
                      onChange={(e) => {
                        const newNav = [...navigation];
                        newNav[index].order = parseInt(e.target.value) || 0;
                        setNavigation(newNav);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => removeNavigationItem(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={saveNavigation} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Navigation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="hello@zoolyum.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <Button onClick={saveSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Contact Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}