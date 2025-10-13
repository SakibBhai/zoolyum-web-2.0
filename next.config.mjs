/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Add experimental flag to help with Next.js 15.5.2 stability
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Move serverComponentsExternalPackages to root level for Next.js 15.5.2
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
  webpack: (config, { dev, isServer }) => {
    // Fix for Next.js 15.5.2 clientReferenceManifest error
    if (dev && !isServer) {
      // Ensure client reference manifest is properly handled
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
          },
        },
      };
    }
    return config;
  },

};

export default nextConfig;