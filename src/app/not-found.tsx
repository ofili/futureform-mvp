import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-full bg-blue-100 p-6">
                            <FileQuestion className="h-16 w-16 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild variant="default" size="lg">
                            <Link href="/">Back to Home</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>

                    {/* Helpful Links */}
                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-4">You might be looking for:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <Link href="/pricing" className="text-blue-600 hover:underline">
                                Pricing
                            </Link>
                            <Link href="/framework" className="text-blue-600 hover:underline">
                                Framework
                            </Link>
                            <Link href="/projects" className="text-blue-600 hover:underline">
                                Projects
                            </Link>
                            <Link href="/contact" className="text-blue-600 hover:underline">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
