'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Mail, Building2, Send, Loader2 } from 'lucide-react';

interface InvitePartnerModalProps {
    projectId: string;
    onClose: () => void;
}

export default function InvitePartnerModal({ projectId, onClose }: InvitePartnerModalProps) {
    const [formData, setFormData] = useState({
        partnerName: '',
        partnerEmail: '',
        method: 'SELF_ASSESS'
    });
    const [sending, setSending] = useState(false);

    const handleInvite = async () => {
        if (!formData.partnerName) return toast.error('Partner name is required');
        if (formData.method === 'SELF_ASSESS' && !formData.partnerEmail) return toast.error('Email is required for self-assessment');

        setSending(true);
        try {
            const res = await fetch('/api/v1/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    projectId,
                    ...formData
                })
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to invite partner');
            }

            toast.success('Partner invited successfully! 🎉');
            onClose();
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to invite partner');
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Invite Partner to Assess</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Add a partner organization to your trust assessment
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Partner Organization Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. GridTech Solutions"
                            value={formData.partnerName}
                            onChange={(e) => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="method" className="text-sm font-medium">
                            Assessment Method
                        </Label>
                        <select
                            id="method"
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.method}
                            onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                        >
                            <option value="SELF_ASSESS">🤝 Invite Partner to Self-Assess (Collaborative)</option>
                            <option value="INDEPENDENT">📋 Assess Independently (Internal Review)</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            {formData.method === 'SELF_ASSESS'
                                ? 'Partner will receive an invitation to complete the assessment themselves'
                                : 'You will assess the partner internally without their direct input'}
                        </p>
                    </div>

                    {formData.method === 'SELF_ASSESS' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                Partner Contact Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contact@partner.com"
                                value={formData.partnerEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, partnerEmail: e.target.value }))}
                                className="h-11"
                            />
                            <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-900">
                                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    They will receive an email with a secure link to complete the trust assessment
                                </p>
                            </div>
                        </div>
                    )}
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
                                Send Invitation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
