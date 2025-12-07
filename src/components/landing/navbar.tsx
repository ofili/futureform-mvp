"use client";
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ChevronDown, Zap, Eye, Shield, Cpu, Briefcase, Landmark, Globe, Building2 } from 'lucide-react';
import { useState, useRef } from 'react';

export function Navbar() {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const productsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const solutionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const products = [
        {
            icon: Zap,
            title: 'Partner Intelligence',
            description: 'AI-powered insights for strategic partnerships',
            href: '/products/partner-intelligence',
            iconColor: 'text-amber-400 group-hover/item:text-amber-300'
        },
        {
            icon: Eye,
            title: 'Deployment Insights',
            description: 'Real-time deployment analytics and monitoring',
            href: '/products/deployment-insights',
            iconColor: 'text-blue-400 group-hover/item:text-blue-300'
        },
        {
            icon: Shield,
            title: 'Trust Signals',
            description: 'Verification and security indicators',
            href: '/products/trust-signals',
            iconColor: 'text-green-400 group-hover/item:text-green-300'
        }
    ];

    const solutions = [
        {
            icon: Briefcase,
            title: 'For Investors',
            description: 'De-risk deals and protect portfolio performance',
            href: '/solutions/investors',
            iconColor: 'text-amber-400 group-hover/item:text-amber-300'
        },
        {
            icon: Landmark,
            title: 'For Governments',
            description: 'Strengthen procurement and reduce corruption risk',
            href: '/solutions/governments',
            iconColor: 'text-blue-400 group-hover/item:text-blue-300'
        },
        {
            icon: Globe,
            title: 'For Development Finance',
            description: 'Deploy impact capital with accountability',
            href: '/solutions/development-finance',
            iconColor: 'text-green-400 group-hover/item:text-green-300'
        },
        {
            icon: Building2,
            title: 'For Enterprises',
            description: 'Verify suppliers and protect supply chains',
            href: '/solutions/enterprises',
            iconColor: 'text-cyan-400 group-hover/item:text-cyan-300'
        }
    ];

    const handleProductsEnter = () => {
        if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
        setIsSolutionsOpen(false);
        setIsProductsOpen(true);
    };

    const handleProductsLeave = () => {
        productsTimeoutRef.current = setTimeout(() => {
            setIsProductsOpen(false);
        }, 150);
    };

    const handleSolutionsEnter = () => {
        if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
        setIsProductsOpen(false);
        setIsSolutionsOpen(true);
    };

    const handleSolutionsLeave = () => {
        solutionsTimeoutRef.current = setTimeout(() => {
            setIsSolutionsOpen(false);
        }, 150);
    };

    return (
        <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/">
                        <Logo />
                    </Link>

                    <div className="flex items-center space-x-8">
                        {/* Products Dropdown - Hover */}
                        <div
                            className="relative"
                            onMouseEnter={handleProductsEnter}
                            onMouseLeave={handleProductsLeave}
                        >
                            <button
                                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors py-2"
                            >
                                <span>Products</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`absolute left-0 mt-0 pt-2 w-96 transition-all duration-200 ${isProductsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl p-6 space-y-4">
                                    {products.map((product) => {
                                        const Icon = product.icon;
                                        return (
                                            <Link
                                                key={product.title}
                                                href={product.href}
                                                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group/item cursor-pointer"
                                            >
                                                <Icon className={`${product.iconColor} transition-colors flex-shrink-0 mt-1`} size={20} />
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold text-sm">{product.title}</h3>
                                                    <p className="text-gray-400 text-xs mt-1">{product.description}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}

                                    <div className="border-t border-gray-700/50 pt-4">
                                        <Link
                                            href="/platform"
                                            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group/item"
                                        >
                                            <Cpu className="text-cyan-400 group-hover/item:text-cyan-300 transition-colors" size={20} />
                                            <div>
                                                <h3 className="text-white font-semibold text-sm">Gitance Engine</h3>
                                                <p className="text-gray-400 text-xs">Core platform infrastructure</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Solutions Dropdown - Hover */}
                        <div
                            className="relative"
                            onMouseEnter={handleSolutionsEnter}
                            onMouseLeave={handleSolutionsLeave}
                        >
                            <button
                                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors py-2"
                            >
                                <span>Solutions</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`absolute left-0 mt-0 pt-2 w-96 transition-all duration-200 ${isSolutionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl p-6 space-y-4">
                                    {solutions.map((solution) => {
                                        const Icon = solution.icon;
                                        return (
                                            <Link
                                                key={solution.title}
                                                href={solution.href}
                                                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group/item cursor-pointer"
                                            >
                                                <Icon className={`${solution.iconColor} transition-colors flex-shrink-0 mt-1`} size={20} />
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold text-sm">{solution.title}</h3>
                                                    <p className="text-gray-400 text-xs mt-1">{solution.description}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                        <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/auth/signup" className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
