'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RequestPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    tierName: string;
}

export function RequestPurchaseModal({ isOpen, onClose, tierName }: RequestPurchaseModalProps) {
    const [note, setNote] = useState('');

    const requestMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/v1/billing/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tierName, note }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send request');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Request sent successfully', {
                description: `Your request for ${tierName} has been sent to your organization administrators.`,
            });
            onClose();
            setNote('');
        },
        onError: (error) => {
            toast.error('Failed to send request', {
                description: error.message,
            });
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-6">
                <DialogHeader>
                    <DialogTitle>Request {tierName}</DialogTitle>
                    <DialogDescription>
                        You don't have permission to purchase this plan. Send a request to your organization's administrators?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Explain why you need this upgrade..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={requestMutation.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={() => requestMutation.mutate()} disabled={requestMutation.isPending}>
                        {requestMutation.isPending ? 'Sending...' : 'Send Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
