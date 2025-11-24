'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import * as Sentry from '@sentry/nextjs'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to console
        console.error('Application error:', error)

        // Log to error tracking service (Sentry) in production
        if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
            Sentry.captureException(error);
        }
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-full bg-red-100 p-6">
                            <AlertTriangle className="h-16 w-16 text-red-600" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something Went Wrong</h2>
                    <p className="text-gray-600 mb-8">
                        We're sorry, but something unexpected happened. Our team has been notified and we're working on it.
                    </p>

                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                            <p className="text-sm font-mono text-red-800 break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-red-600 mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button onClick={reset} variant="default" size="lg">
                            Try Again
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            If this problem persists, please{' '}
                            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                                contact our support team
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
