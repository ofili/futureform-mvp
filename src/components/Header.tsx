import React from 'react';
import Link from 'next/link';
import NotificationCenter from './notifications/NotificationCenter';
import GlobalSearch from './search/GlobalSearch';
import MobileNav from './mobile/MobileNav';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            Gitance
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600">
                            About
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                            Contact
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <GlobalSearch />
                        <NotificationCenter />
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;