import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Replace the old experimental key
  serverExternalPackages: ['@prisma/client'],

  // Custom webpack configuration for TypeScript files
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle .ts imports from app/generated
    config.resolve.extensions.push('.ts', '.tsx');

    // Add rule for Prisma generated TS files
    config.module.rules.push({
      test: /\.ts$/,
      include: [/app\/generated/],
      use: [defaultLoaders.babel],
    });

    return config;
  },
};

export default nextConfig;
