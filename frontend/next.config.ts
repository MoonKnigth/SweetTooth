import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kaceebest.com',
      },
    ],
  },
  output: 'standalone',
  allowedDevOrigins: ['192.168.1.162'],
};

export default nextConfig;
