'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface InviteMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteMembersModal({ isOpen, onClose }: InviteMembersModalProps) {
    const [emails, setEmails] = useState<string[]>(['']);
    const queryClient = useQueryClient();

    const addEmailField = () => {
        if (emails.length < 5) {
            setEmails([...emails, '']);
        }
    };

    const removeEmailField = (index: number) => {
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        setEmails(newEmails);
    };

    const updateEmail = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const inviteMutation = useMutation({
        mutationFn: async () => {
            const validEmails = emails.filter(e => e.trim() !== '');
            if (validEmails.length === 0) throw new Error('Please enter at least one email');

            const response = await fetch('/api/v1/organization/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: validEmails }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send invites');
            }
            return response.json();
        },
        onSuccess: (data) => {
            const successCount = data.results.filter((r: any) => r.status === 'success').length;
            const failedCount = data.results.length - successCount;

            if (successCount > 0) {
                toast.success(`Successfully sent ${successCount} invitation${successCount > 1 ? 's' : ''}`);
            }

            if (failedCount > 0) {
                toast.error(`Failed to send ${failedCount} invitation${failedCount > 1 ? 's' : ''}`);
            }

            queryClient.invalidateQueries({ queryKey: ['organization-members'] });
            onClose();
            setEmails(['']);
        },
        onError: (error) => {
            toast.error('Failed to send invites', {
                description: error.message,
            });
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-6">
                <DialogHeader>
                    <DialogTitle>Invite Team Members</DialogTitle>
                    <DialogDescription>
                        Invite colleagues to join your organization. They will receive an email with a link to create their account.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        {emails.map((email, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="grid gap-2 flex-1">
                                    <Label htmlFor={`email-${index}`} className="sr-only">
                                        Email {index + 1}
                                    </Label>
                                    <Input
                                        id={`email-${index}`}
                                        placeholder="colleague@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => updateEmail(index, e.target.value)}
                                    />
                                </div>
                                {emails.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEmailField(index)}
                                        className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {emails.length < 5 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed"
                            onClick={addEmailField}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Another Email
                        </Button>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={inviteMutation.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={() => inviteMutation.mutate()} disabled={inviteMutation.isPending}>
                        {inviteMutation.isPending ? 'Sending...' : 'Send Invites'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
