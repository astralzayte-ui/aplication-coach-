import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Empty turbopack config to suppress the warning
  turbopack: {},
  serverExternalPackages: ['better-sqlite3', 'playwright', '@playwright/test'],
};

export default nextConfig;
