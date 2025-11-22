import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';

interface ProjectsHeaderProps {
    viewMode: 'card' | 'table';
    onViewModeChange: (mode: 'card' | 'table') => void;
}

export function ProjectsHeader({ viewMode, onViewModeChange }: ProjectsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground">Manage your trust assessment projects</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                    <Button
                        className={`h-9 px-3 rounded-r-none ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => onViewModeChange('card')}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        className={`h-9 px-3 rounded-l-none ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => onViewModeChange('table')}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
                <Link href="/projects/new">
                    <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>
        </div>
    );
}
