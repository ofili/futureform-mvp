'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [transaction, setTransaction] = useState<any>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const transactionRef = searchParams.get('ref');

        if (!transactionRef) {
            setStatus('failed');
            setError('No transaction reference found');
            return;
        }

        verifyPayment(transactionRef);
    }, [searchParams]);

    const verifyPayment = async (transactionRef: string) => {
        try {
            const response = await fetch('/api/v1/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionRef }),
            });

            const data = await response.json();

            if (data.success && data.status === 'COMPLETED') {
                setStatus('success');
                setTransaction(data.transaction);
            } else {
                setStatus('failed');
                setError(data.error || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('failed');
            setError('Failed to verify payment. Please contact support.');
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        if (currency === 'NGN') {
            return `₦${amount.toLocaleString()}`;
        }
        return `$${amount.toLocaleString()}`;
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'TIER_UPGRADE':
                return 'Subscription Upgrade';
            case 'RC_PURCHASE':
                return 'Respondent Credits';
            case 'EC_PURCHASE':
                return 'Evidence Credits';
            default:
                return 'Payment';
        }
    };

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                            <p className="text-sm text-gray-600">
                                Please wait while we confirm your payment with Flutterwave.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <CardTitle>Payment Failed</CardTitle>
                                <CardDescription>There was an issue with your payment</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard/credits')}
                                className="flex-1"
                            >
                                Back to Credits
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                className="flex-1"
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <CardTitle>Payment Successful!</CardTitle>
                            <CardDescription>Your payment has been processed</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Type</span>
                            <span className="text-sm text-gray-900">{getTypeLabel(transaction?.type)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Amount</span>
                            <span className="text-sm font-bold text-gray-900">
                                {formatAmount(transaction?.amount, transaction?.currency)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Transaction ID</span>
                            <span className="text-xs text-gray-600 font-mono">{transaction?.id}</span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        {transaction?.type === 'TIER_UPGRADE' && (
                            <p>Your subscription tier has been upgraded successfully.</p>
                        )}
                        {transaction?.type === 'RC_PURCHASE' && (
                            <p>Respondent credits have been added to your account.</p>
                        )}
                        {transaction?.type === 'EC_PURCHASE' && (
                            <p>Evidence credits have been added to your account.</p>
                        )}
                    </div>

                    <Button
                        onClick={() => router.push('/dashboard/credits')}
                        className="w-full"
                    >
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
