
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Mail, Shield, Send, Loader2, Info } from 'lucide-react';

export default function InviteOrganizationMemberModal({ organizationId, onClose }: { organizationId: string; onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [sending, setSending] = useState(false);

    const handleInvite = async () => {
        if (!email) return toast.error('Email is required');
        setSending(true);
        try {
            const res = await fetch(`/api/v1/organizations/${organizationId}/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, role }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Invite failed');
            toast.success(json.autoAccepted ? 'Member added! 🎉' : 'Invitation sent! 📧');
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to invite member');
        } finally {
            setSending(false);
        }
    };

    const roleDescriptions: Record<string, string> = {
        OWNER: 'Full control over the organization',
        ADMIN: 'Manage members and settings',
        MEMBER: 'Standard access to projects',
        VIEWER: 'View-only access'
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Invite Team Member</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Add a member to your organization
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 space-y-5 py-4">
                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-900">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            If the email is not registered, they will receive an invite to create an account first
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            Role & Permissions
                        </Label>
                        <select
                            id="role"
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="OWNER">👑 Owner</option>
                            <option value="ADMIN">⚙️ Admin</option>
                            <option value="MEMBER">👤 Member</option>
                            <option value="VIEWER">👁️ Viewer</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            {roleDescriptions[role]}
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={sending} className="h-11">
                        Cancel
                    </Button>
                    <Button onClick={handleInvite} disabled={sending} className="h-11 min-w-[140px]">
                        {sending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Invite
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
