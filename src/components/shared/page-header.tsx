'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Grid, List, MoreHorizontal, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: React.ReactNode;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    viewMode?: 'card' | 'table';
    onViewModeChange?: (mode: 'card' | 'table') => void;
    showViewToggle?: boolean;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    viewMode,
    onViewModeChange,
    showViewToggle = false
}: PageHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1 text-sm text-gray-500">
                    <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-1">
                            <ChevronRight className="w-4 h-4" />
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-gray-700">{crumb.label}</Link>
                            ) : (
                                <span className="text-gray-900 font-medium">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            {/* Command Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border shadow-sm">
                {/* Left: Title & Description */}
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>

                {/* Center: Search (if enabled) */}
                {onSearchChange && (
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    </div>
                )}

                {/* Right: View Toggle & Actions */}
                <div className="flex items-center gap-3">
                    {showViewToggle && onViewModeChange && (
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => onViewModeChange('card')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onViewModeChange('table')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {actions}
                </div>
            </div>
        </div>
    );
}
