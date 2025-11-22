import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo />
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex items-center justify-center py-12 px-4">
                {children}
            </div>
        </div>
    );
}
