'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Plus, FileText, Search, Bell, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function DashboardHeader() {
    const user = useAuthStore((s) => s.user);
    const tier = user?.tier || 'Free';
    const firstName = user?.name?.split(' ')[0] || 'there';

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Command Bar */}
                <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border shadow-sm">
                    {/* Left: Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search projects, partners, assessments..."
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Center: Quick Actions */}
                    <div className="flex items-center gap-2">
                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Link href="/projects/new?mode=single">
                                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Quick Assessment
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Evaluate a single partner</TooltipContent>
                        </UITooltip>

                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Link href="/projects/new">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Project
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Start a multi-partner assessment</TooltipContent>
                        </UITooltip>
                    </div>

                    {/* Right: Notifications & Profile */}
                    <div className="flex items-center gap-3">
                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5 text-gray-500" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Notifications</TooltipContent>
                        </UITooltip>

                        <div className="h-6 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Greeting & Overview */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {getGreeting()}, {firstName} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Here's what's happening with your trust intelligence today
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            {tier} Plan
                        </Badge>
                        <Link href="/projects">
                            <Button variant="ghost" size="sm" className="text-gray-600">
                                View all projects
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
