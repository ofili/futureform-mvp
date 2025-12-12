import { EntityIdDisplay } from '@/components/ui/entity-id-display';

export function SettingsHeader({ userId }: { userId?: string }) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    {userId && <EntityIdDisplay entityId={userId} entityType="User" />}
                </div>
                <p className="text-muted-foreground mt-1">Manage your profile and account preferences</p>
            </div>
        </div>
    );
}
