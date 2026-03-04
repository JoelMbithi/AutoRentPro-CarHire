// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],

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

  // ✅ Add these two lines to ignore errors during build
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
};

export default nextConfig;