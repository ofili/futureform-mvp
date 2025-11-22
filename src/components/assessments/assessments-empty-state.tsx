import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function AssessmentsEmptyState() {
    return (
        <Card>
            <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No assessments yet</h3>
                <p className="text-muted-foreground mb-6">Create a project and invite partners to start assessments</p>
                <Link href="/projects/new">
                    <Button>
                        <FileText className="w-4 h-4 mr-2" />
                        Create Project
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
