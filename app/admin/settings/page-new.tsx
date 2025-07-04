import { Suspense } from "react";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsContent } from "./settings-content";
import { SettingsSkeleton } from "./settings-skeleton";

// Server Component - Main page wrapper
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsPageHeader />
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsWrapper />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching wrapper
async function SettingsWrapper() {
  // Fetch settings on the server
  const settings = await getSettings();

  return <SettingsContent initialSettings={settings} />;
}

// Server-side data fetching function
async function getSettings() {
  try {
    // Mock settings for now - in a real app, fetch from database
    return {
      siteName: "Zoolyum",
      siteDescription: "Creative Design Studio",
      contactEmail: "hello@zoolyum.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Creative Street, Design City, DC 12345",
      socialLinks: {
        twitter: "https://twitter.com/zoolyum",
        facebook: "https://facebook.com/zoolyum",
        instagram: "https://instagram.com/zoolyum",
        linkedin: "https://linkedin.com/company/zoolyum",
      },
      appearance: {
        primaryColor: "#FF5001",
        darkMode: false,
      },
      seo: {
        metaTitle: "Zoolyum - Creative Design Studio",
        metaDescription: "We create amazing digital experiences",
        keywords: ["design", "creative", "studio"],
      },
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
