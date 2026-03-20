// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],

  //  Add image configuration here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },

  webpack: (config, { defaultLoaders }) => {
    // Support .ts and .tsx
    config.resolve!.extensions.push('.ts', '.tsx');

    // Add rule for Prisma generated TS files
    config.module.rules.push({
      test: /\.ts$/,
      include: [/app\/generated/],
      use: [defaultLoaders.babel],
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/dashboard/:path*',
        destination: '/features/Admin/Dashboard/api/dashboard/:path*',
      },
    ];
  },

  // Ignore errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;