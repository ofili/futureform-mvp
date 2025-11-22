'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAssessmentPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to project creation page in single mode
        router.replace('/projects/new?mode=single');
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <p className="text-center text-muted-foreground">Redirecting to project creation...</p>
        </div>
    );
}
