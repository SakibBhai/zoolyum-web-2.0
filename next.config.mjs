/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
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
  // experimental: {
  //   optimizePackageImports: ['@prisma/client', 'lucide-react'],
  // },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack cache serialization to reduce warnings
    if (dev) {
      config.cache = {
        ...config.cache,
        compression: 'gzip',
        maxMemoryGenerations: 1,
      };
    }
    return config;
  },

};

export default nextConfig;