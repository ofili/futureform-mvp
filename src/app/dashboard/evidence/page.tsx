'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EvidenceList } from '@/components/evidence/evidence-list';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export default function EvidencePage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.organizationId) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Required</CardTitle>
                        <CardDescription>
                            You need to belong to an organization to view evidence.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evidence Library</h1>
                    <p className="text-muted-foreground">
                        Manage and track your assessment evidence (AE, VE, DSE)
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Evidence
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Evidence</CardTitle>
                    <CardDescription>
                        View the status and verification results of your submitted evidence.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EvidenceList organizationId={session.user.organizationId} />
                </CardContent>
            </Card>
        </div>
    );
}
