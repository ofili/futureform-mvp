import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Logo />

                        <div className="hidden md:flex items-center gap-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors outline-none">
                                    Products <ChevronDown className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuItem asChild>
                                        <Link href="/products/partner-intelligence" className="w-full cursor-pointer">
                                            Partner Intelligence
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/products/deployment-insights" className="w-full cursor-pointer">
                                            Deployment Insights
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/products/trust-signals" className="w-full cursor-pointer">
                                            Trust Signals
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link
                                href="/platform/engine"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Platform
                            </Link>

                            <Link
                                href="/pricing"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Pricing
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium hidden sm:block">
                            Login
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
