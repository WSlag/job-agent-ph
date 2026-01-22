import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: false, // Disable to avoid async issues
  aggressiveFrontEndNavCaching: false, // Disable to avoid async issues
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    // Disable the problematic cacheWillUpdate plugin
    // by simplifying the runtime caching configuration
    runtimeCaching: [
      {
        // Use regex pattern instead of function to avoid 'self' reference issues
        urlPattern: /^\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'same-origin-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
  // Disable features that cause transpilation issues
  cacheStartUrl: false, // This disables the problematic start-url route
  dynamicStartUrl: false, // Disable dynamic start URL
  fallbacks: undefined,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Explicitly set workspace root for Firebase App Hosting
  outputFileTracingRoot: require('path').join(__dirname),
  // Add comprehensive security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Existing headers
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          // Additional security headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Content Security Policy - allowing necessary external resources
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.google.com https://www.recaptcha.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://recaptcha.net",
              "frame-src 'self' https://accounts.google.com https://www.google.com https://*.firebaseapp.com https://www.recaptcha.net https://recaptcha.net",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
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
    // Cache optimized images for longer to reduce re-fetching
    minimumCacheTTL: 86400, // 24 hours
    // Skip optimization in development to avoid timeout issues with large images
    unoptimized: process.env.NODE_ENV === 'development',
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

export default withPWA(withBundleAnalyzer(nextConfig));
