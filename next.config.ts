import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Firebase Storage - for uploaded images
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      // Google user profile images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Unsplash - for placeholder/hero images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other specific domains as needed
    ],
  },
  // Enable production optimizations
  swcMinify: true,
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default withBundleAnalyzer(nextConfig);
