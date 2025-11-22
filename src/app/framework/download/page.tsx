'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

function FrameworkDownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!token) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/v1/framework/pdf?token=${token}`);
      if (response && response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FutureForm-Trust-Framework-Guide.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Backend server is not running. Please start the backend server.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Backend server is not running. Please start the backend server.');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleDownload();
    }
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your download should start automatically. If it doesn't, click the button below.
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isDownloading || !token}
          >
            {isDownloading ? 'Downloading...' : 'Download Framework Guide'}
          </Button>

          <div className="text-sm text-gray-500">
            <p>The Five-Layer Trust Framework™ Guide</p>
            <p>PDF • Comprehensive Implementation Guide</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Try FutureForm's trust intelligence platform with a free assessment.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Run Free Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FrameworkDownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-gray-600">
            Loading...
          </div>
        </div>
      }>
        <FrameworkDownloadContent />
      </Suspense>
    </div>
  );
}