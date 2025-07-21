'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSection {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage?: string;
  isActive: boolean;
}

interface AboutSection {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  isActive: boolean;
}

interface Statistic {
  id?: string;
  label: string;
  value: string;
  suffix: string;
  order: number;
  isActive: boolean;
}

interface Service {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Section {
  id?: string;
  sectionType: string;
  title: string;
  subtitle: string;
  content: string;
  isVisible: boolean;
  order: number;
  isActive: boolean;
}

export default function HomepageManager() {
  const [heroData, setHeroData] = useState<HeroSection>({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaUrl: '',
    isActive: true
  });

  const [aboutData, setAboutData] = useState<AboutSection>({
    title: '',
    subtitle: '',
    description: '',
    isActive: true
  });

  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [heroRes, aboutRes, statsRes, servicesRes, sectionsRes] = await Promise.all([
        fetch('/api/homepage/hero'),
        fetch('/api/homepage/about'),
        fetch('/api/homepage/statistics'),
        fetch('/api/homepage/services'),
        fetch('/api/homepage/sections')
      ]);

      if (heroRes.ok) {
        const heroData = await heroRes.json();
        setHeroData(heroData);
      }

      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        setAboutData(aboutData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatistics(Array.isArray(statsData) ? statsData : []);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(Array.isArray(servicesData) ? servicesData : []);
      }

      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json();
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load homepage data');
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSection = async () => {
    try {
      const response = await fetch('/api/homepage/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });

      if (response.ok) {
        toast.success('Hero section updated successfully');
      } else {
        toast.error('Failed to update hero section');
      }
    } catch (error) {
      toast.error('Error updating hero section');
    }
  };

  const saveAboutSection = async () => {
    try {
      const response = await fetch('/api/homepage/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      });

      if (response.ok) {
        toast.success('About section updated successfully');
      } else {
        toast.error('Failed to update about section');
      }
    } catch (error) {
      toast.error('Error updating about section');
    }
  };

  const saveStatistics = async () => {
    try {
      const response = await fetch('/api/homepage/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statistics })
      });

      if (response.ok) {
        toast.success('Statistics updated successfully');
      } else {
        toast.error('Failed to update statistics');
      }
    } catch (error) {
      toast.error('Error updating statistics');
    }
  };

  const saveServices = async () => {
    try {
      const response = await fetch('/api/homepage/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services })
      });

      if (response.ok) {
        toast.success('Services updated successfully');
      } else {
        toast.error('Failed to update services');
      }
    } catch (error) {
      toast.error('Error updating services');
    }
  };

  const saveSections = async () => {
    try {
      const response = await fetch('/api/homepage/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections })
      });

      if (response.ok) {
        toast.success('Sections updated successfully');
      } else {
        toast.error('Failed to update sections');
      }
    } catch (error) {
      toast.error('Error updating sections');
    }
  };

  const addStatistic = () => {
    setStatistics([...statistics, {
      label: '',
      value: '',
      suffix: '',
      order: statistics.length,
      isActive: true
    }]);
  };

  const removeStatistic = (index: number) => {
    setStatistics(statistics.filter((_, i) => i !== index));
  };

  const addService = () => {
    setServices([...services, {
      title: '',
      description: '',
      icon: '',
      order: services.length,
      isActive: true
    }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const addSection = () => {
    setSections([...sections, {
      sectionType: '',
      title: '',
      subtitle: '',
      content: '',
      isVisible: true,
      order: sections.length,
      isActive: true
    }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading homepage data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Homepage Content Manager</h1>
        <Badge variant="outline">CMS Dashboard</Badge>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="sections">Other Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    placeholder="Enter hero title"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    placeholder="Enter hero subtitle"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  placeholder="Enter hero description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-cta-text">CTA Text</Label>
                  <Input
                    id="hero-cta-text"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                    placeholder="Call to action text"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-cta-url">CTA URL</Label>
                  <Input
                    id="hero-cta-url"
                    value={heroData.ctaUrl}
                    onChange={(e) => setHeroData({ ...heroData, ctaUrl: e.target.value })}
                    placeholder="Call to action URL"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hero-bg-image">Background Image URL</Label>
                <Input
                  id="hero-bg-image"
                  value={heroData.backgroundImage || ''}
                  onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
                  placeholder="Background image URL (optional)"
                />
              </div>
              <Button onClick={saveHeroSection} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Hero Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="about-title">Title</Label>
                  <Input
                    id="about-title"
                    value={aboutData.title}
                    onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                    placeholder="Enter about title"
                  />
                </div>
                <div>
                  <Label htmlFor="about-subtitle">Subtitle</Label>
                  <Input
                    id="about-subtitle"
                    value={aboutData.subtitle}
                    onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                    placeholder="Enter about subtitle"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="about-description">Description</Label>
                <Textarea
                  id="about-description"
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  placeholder="Enter about description"
                  rows={4}
                />
              </div>
              <Button onClick={saveAboutSection} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save About Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Statistics
                <Button onClick={addStatistic} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Statistic
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics.map((stat, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...statistics];
                        newStats[index].label = e.target.value;
                        setStatistics(newStats);
                      }}
                      placeholder="Years Experience"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...statistics];
                        newStats[index].value = e.target.value;
                        setStatistics(newStats);
                      }}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label>Suffix</Label>
                    <Input
                      value={stat.suffix}
                      onChange={(e) => {
                        const newStats = [...statistics];
                        newStats[index].suffix = e.target.value;
                        setStatistics(newStats);
                      }}
                      placeholder="+"
                    />
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={stat.order}
                      onChange={(e) => {
                        const newStats = [...statistics];
                        newStats[index].order = parseInt(e.target.value) || 0;
                        setStatistics(newStats);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => removeStatistic(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={saveStatistics} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Statistics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Services
                <Button onClick={addService} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].title = e.target.value;
                        setServices(newServices);
                      }}
                      placeholder="Brand Strategy"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].description = e.target.value;
                        setServices(newServices);
                      }}
                      placeholder="Service description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={service.icon}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].icon = e.target.value;
                        setServices(newServices);
                      }}
                      placeholder="strategy"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => removeService(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={saveServices} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Services
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Other Sections
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Section Type</Label>
                      <Input
                        value={section.sectionType}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].sectionType = e.target.value;
                          setSections(newSections);
                        }}
                        placeholder="featured_work"
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].title = e.target.value;
                          setSections(newSections);
                        }}
                        placeholder="Section Title"
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input
                        value={section.subtitle}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].subtitle = e.target.value;
                          setSections(newSections);
                        }}
                        placeholder="Section Subtitle"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={section.content}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[index].content = e.target.value;
                        setSections(newSections);
                      }}
                      placeholder="Section content"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(checked) => {
                          const newSections = [...sections];
                          newSections[index].isVisible = checked;
                          setSections(newSections);
                        }}
                      />
                      <Label>Visible</Label>
                    </div>
                    <Button
                      onClick={() => removeSection(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={saveSections} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Sections
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}