import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

export function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo />

                    <div className="flex items-center gap-6">
                        <Link
                            href="/pricing"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link href="/auth/register">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
