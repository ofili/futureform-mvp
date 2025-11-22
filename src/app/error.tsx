'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong!</h1>
            <p className="mb-8 max-w-[500px] text-muted-foreground">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}
