'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Plus, FileText } from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';
import { Badge } from '@/components/ui/badge';

export function DashboardHeader() {
    const user = useAuthStore((s) => s.user);
    const tier = user?.tier || 'Free';

    return (
        <TooltipProvider>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligence Dashboard</h1>
                        <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">
                            {tier} Plan
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time trust assessment monitoring & analytics</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/projects">
                        <Button variant="outline" size="lg">
                            <FileText className="w-4 h-4 mr-2" />
                            Projects
                        </Button>
                    </Link>
                    <UITooltip>
                        <TooltipTrigger asChild>
                            <Link href="/projects/new?mode=single">
                                <Button variant="outline" size="lg">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Quick Assessment
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Evaluate a single partner (Standalone)</p>
                        </TooltipContent>
                    </UITooltip>
                    <UITooltip>
                        <TooltipTrigger asChild>
                            <Link href="/projects/new">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Project
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Start a new multi-partner assessment project</p>
                        </TooltipContent>
                    </UITooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
