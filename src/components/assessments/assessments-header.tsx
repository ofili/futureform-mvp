import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function AssessmentsHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold">Assessments</h1>
                <p className="text-muted-foreground">Track partner trust assessments and results</p>
            </div>
            <Link href="/assessments/new">
                <Button size="lg">
                    <FileText className="w-4 h-4 mr-2" />
                    New Assessment
                </Button>
            </Link>
        </div>
    );
}
