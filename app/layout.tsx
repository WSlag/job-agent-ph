import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import InstallPWABanner from "@/components/pwa/InstallPWABanner";
import IOSInstallModal from "@/components/pwa/iOSInstallModal";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Job Agent PH - Find Your Dream Job Abroad",
  description: "Connect with recruitment agencies and find jobs abroad. Made for Filipinos, by Filipinos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Job Agent PH",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased pb-14 md:pb-0 md:pt-16`}>
        <ErrorBoundary>
          <AuthProvider>
            <ConditionalHeader />
            {children}
            <Suspense fallback={null}>
              <BottomNav />
            </Suspense>

            {/* PWA Install Banner */}
            <InstallPWABanner />

            {/* iOS Install Modal */}
            <IOSInstallModal />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#363636',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
