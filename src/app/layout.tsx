import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FutureForm - Trust Intelligence for Emerging Markets',
    template: '%s | FutureForm',
  },
  description: 'Quantify organizational trust before partnerships fail. The Six-Layer Trust Framework™ for emerging market due diligence.',
  keywords: ['trust intelligence', 'due diligence', 'emerging markets', 'partner assessment', 'vendor evaluation', 'trust framework'],
  authors: [{ name: 'FutureForm Ltd' }],
  creator: 'FutureForm Ltd',
  publisher: 'FutureForm Ltd',
  metadataBase: new URL('https://futureform.africa'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://futureform.africa',
    title: 'FutureForm - Trust Intelligence for Emerging Markets',
    description: 'Quantify organizational trust before partnerships fail',
    siteName: 'FutureForm',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FutureForm - Trust Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FutureForm - Trust Intelligence for Emerging Markets',
    description: 'Quantify organizational trust before partnerships fail',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <TooltipProvider>
                {children}
                <SpeedInsights />
              </TooltipProvider>
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}