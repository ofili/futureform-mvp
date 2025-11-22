import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Page Not Found</h1>
            <p className="mb-8 max-w-[500px] text-muted-foreground">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="default">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    )
}
