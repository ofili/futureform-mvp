'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Receipt, TrendingUp, CreditCard, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PaymentTransaction {
    id: string;
    type: 'TIER_UPGRADE' | 'RC_PURCHASE' | 'EC_PURCHASE';
    amount: number;
    currency: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    createdAt: string;
    completedAt?: string;
    package?: {
        name: string;
        displayName: string;
    };
    tier?: {
        name: string;
        displayName: string;
    };
}

interface PaymentHistoryProps {
    organizationId: string;
}

export function PaymentHistory({ organizationId }: PaymentHistoryProps) {
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchTransactions();
    }, [organizationId]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`/api/v1/payments/transactions?organizationId=${organizationId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            COMPLETED: 'default',
            PENDING: 'secondary',
            PROCESSING: 'secondary',
            FAILED: 'destructive',
            CANCELLED: 'outline',
            REFUNDED: 'outline',
        };

        return (
            <Badge variant={variants[status] || 'outline'}>
                {status}
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'TIER_UPGRADE':
                return <TrendingUp className="h-4 w-4 text-blue-600" />;
            case 'RC_PURCHASE':
                return <CreditCard className="h-4 w-4 text-green-600" />;
            case 'EC_PURCHASE':
                return <FileText className="h-4 w-4 text-purple-600" />;
            default:
                return <Receipt className="h-4 w-4 text-gray-600" />;
        }
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

    const formatAmount = (amount: number, currency: string) => {
        if (currency === 'NGN') {
            return `₦${amount.toLocaleString()}`;
        }
        return `$${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-sm text-red-600">
                        {error}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No payment history yet</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    {getTypeIcon(transaction.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">
                                            {transaction.package?.displayName || transaction.tier?.displayName || getTypeLabel(transaction.type)}
                                        </p>
                                        {getStatusBadge(transaction.status)}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">
                                    {formatAmount(transaction.amount, transaction.currency)}
                                </p>
                                {transaction.completedAt && (
                                    <p className="text-xs text-gray-500">
                                        Completed
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
