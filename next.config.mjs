/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable Turbopack explicitly for Next.js 16
  turbopack: {},
  // Add experimental flag to help with Next.js 16 stability
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Move serverComponentsExternalPackages to root level for Next.js 16
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    localPatterns: [
      {
        pathname: '/placeholder.svg**',
        search: '',
      },
      {
        pathname: '/zoolyum-logo.png**',
        search: '',
      },
      {
        pathname: '/**',
        search: '',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;