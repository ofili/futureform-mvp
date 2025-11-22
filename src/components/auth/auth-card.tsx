import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
    title: string;
    children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
