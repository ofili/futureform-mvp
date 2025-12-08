'use client';

import Link from 'next/link';
import { FileText, Users, TrendingUp, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAccessItem {
    id: string;
    type: 'project' | 'assessment' | 'partner';
    name: string;
    lastAccessed: string;
    status?: string;
    score?: number;
}

interface QuickAccessPanelProps {
    items?: QuickAccessItem[];
}

export function QuickAccessPanel({ items }: QuickAccessPanelProps) {
    // Mock data if none provided
    const defaultItems: QuickAccessItem[] = [
        { id: '1', type: 'project', name: 'Q4 Vendor Compliance', lastAccessed: '2 hours ago', status: 'In Progress' },
        { id: '2', type: 'assessment', name: 'Partner Alpha - Security Review', lastAccessed: '5 hours ago', score: 82 },
        { id: '3', type: 'partner', name: 'TechVentures Inc.', lastAccessed: '1 day ago', status: 'Active' },
        { id: '4', type: 'project', name: 'Infrastructure Due Diligence', lastAccessed: '2 days ago', status: 'Pending Review' },
    ];

    const displayItems = items || defaultItems;

    const getIcon = (type: string) => {
        switch (type) {
            case 'project': return FileText;
            case 'assessment': return TrendingUp;
            case 'partner': return Users;
            default: return FileText;
        }
    };

    const getHref = (item: QuickAccessItem) => {
        switch (item.type) {
            case 'project': return `/projects/${item.id}`;
            case 'assessment': return `/assessments/${item.id}`;
            case 'partner': return `/partners/${item.id}`;
            default: return '#';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'project': return 'bg-blue-100 text-blue-600';
            case 'assessment': return 'bg-green-100 text-green-600';
            case 'partner': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">Quick Access</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                {displayItems.map((item) => {
                    const Icon = getIcon(item.type);
                    return (
                        <Link
                            key={item.id}
                            href={getHref(item)}
                            className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {item.score !== undefined && (
                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${item.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            Score: {item.score}
                                        </span>
                                    )}
                                    {item.status && (
                                        <span className="text-xs text-gray-500">{item.status}</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{item.lastAccessed}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50/50">
                <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View all recent items
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
