'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    type: 'TIER_UPGRADE' | 'RC_PURCHASE' | 'EC_PURCHASE';
    organizationId: string;
    amount: number;
    currency?: 'NGN' | 'USD';
    tierId?: string;
    packageId?: string;
    packageName?: string;
    packageDescription?: string;
}

export function PaymentModal({
    open,
    onClose,
    type,
    organizationId,
    amount,
    currency = 'NGN',
    tierId,
    packageId,
    packageName,
    packageDescription,
}: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const getIcon = () => {
        switch (type) {
            case 'TIER_UPGRADE':
                return <TrendingUp className="h-6 w-6 text-blue-600" />;
            case 'RC_PURCHASE':
                return <CreditCard className="h-6 w-6 text-green-600" />;
            case 'EC_PURCHASE':
                return <FileText className="h-6 w-6 text-purple-600" />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'TIER_UPGRADE':
                return 'Upgrade Subscription Tier';
            case 'RC_PURCHASE':
                return 'Purchase Respondent Credits';
            case 'EC_PURCHASE':
                return 'Purchase Evidence Credits';
        }
    };

    const formatAmount = (amt: number, curr: string) => {
        if (curr === 'NGN') {
            return `₦${amt.toLocaleString()}`;
        }
        return `$${amt.toLocaleString()}`;
    };

    const handlePayment = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/v1/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    organizationId,
                    amount,
                    currency,
                    tierId,
                    packageId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // Redirect to Flutterwave payment page
            window.location.href = data.paymentLink;
        } catch (error) {
            console.error('Payment initialization error:', error);
            toast({
                title: 'Payment Failed',
                description: error instanceof Error ? error.message : 'Failed to initialize payment',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        {getIcon()}
                        <DialogTitle>{getTitle()}</DialogTitle>
                    </div>
                    <DialogDescription>
                        You will be redirected to Flutterwave to complete your payment securely.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {packageName && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Package</h4>
                            <p className="text-base">{packageName}</p>
                        </div>
                    )}

                    {packageDescription && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{packageDescription}</p>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {formatAmount(amount, currency)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-xs text-blue-800">
                            🔒 Your payment is secured by Flutterwave. You will be redirected to their secure payment page.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={loading}
                        className="min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay {formatAmount(amount, currency)}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
