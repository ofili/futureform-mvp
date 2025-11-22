import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export function ProjectsEmptyState() {
    return (
        <Card>
            <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or create a new project</p>
                <Link href="/projects/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
