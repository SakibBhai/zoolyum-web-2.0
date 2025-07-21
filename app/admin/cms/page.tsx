import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Settings, BarChart3, Users, FileText } from 'lucide-react';
import HomepageManager from '@/components/admin/HomepageManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';

export const metadata: Metadata = {
  title: 'CMS Dashboard | Zoolyum Admin',
  description: 'Content Management System for Zoolyum website',
};

export default function CMSPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Content Management System</h1>
            <p className="text-muted-foreground mt-2">
              Manage your website content, settings, and configuration
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Admin Dashboard
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Homepage Sections</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Editable content sections
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Site Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Configuration options
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Navigation Items</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Menu navigation links
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Types</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Manageable content models
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main CMS Interface */}
        <Tabs defaultValue="homepage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Homepage Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Homepage Content Management
                </CardTitle>
                <CardDescription>
                  Edit and manage all homepage sections including hero, about, statistics, services, and other content areas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Configuration
                </CardTitle>
                <CardDescription>
                  Manage global site settings, SEO configuration, social media links, and navigation menu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <p>Zoolyum CMS Dashboard v1.0</p>
              <p>Built with Next.js, Prisma, and PostgreSQL</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Production Ready</Badge>
              <Badge variant="outline">Secure</Badge>
              <Badge variant="outline">Real-time</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}