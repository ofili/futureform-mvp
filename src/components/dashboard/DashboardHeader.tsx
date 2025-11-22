import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/theme-toggle';

interface Props {
    stats?: any;
}

export default function DashboardHeader({ stats }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor your trust assessments and project progress
                </p>
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link href="/projects">
                    <Button variant="outline" size="lg">
                        <FileText className="w-4 h-4 mr-2" />
                        View All Projects
                    </Button>
                </Link>
                <Link href="/projects/new">
                    <Button size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>
        </div>
    );
}
