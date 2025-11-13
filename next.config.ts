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
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix Firebase client-side bundling issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    // Optimize Firebase bundle size
    optimizePackageImports: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
  },
};

export default withBundleAnalyzer(nextConfig);
