import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DangerZoneProps {
    onLogout: () => void;
}

export function DangerZone({ onLogout }: DangerZoneProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Sign out</p>
                        <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                    </div>
                    <Button variant="destructive" onClick={onLogout}>Sign out</Button>
                </div>
            </CardContent>
        </Card>
    );
}
