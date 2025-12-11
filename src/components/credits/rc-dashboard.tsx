'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Plus, History, CreditCard, Users } from 'lucide-react';
import { format } from 'date-fns';
import { RCBalance, RCTransaction } from '@/services/credits/rc.service';
import { useToast } from '@/components/ui/use-toast';

interface RCDashboardProps {
    organizationId: string;
}

export function RCDashboard({ organizationId }: RCDashboardProps) {
    const [balance, setBalance] = useState<RCBalance | null>(null);
    const [transactions, setTransactions] = useState<RCTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [balanceRes, txRes] = await Promise.all([
                fetch(`/api/v1/credits/rc/balance?organizationId=${organizationId}`),
                fetch(`/api/v1/credits/rc/transactions?organizationId=${organizationId}&limit=10`)
            ]);

            if (!balanceRes.ok || !txRes.ok) throw new Error('Failed to fetch data');

            const balanceData = await balanceRes.json();
            const txData = await txRes.json();

            setBalance(balanceData);
            setTransactions(txData);
        } catch (error) {
            console.error('Error fetching RC data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load credit data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance?.totalAvailable || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Respondent Credits (RC)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Used</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance?.totalUsed || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime consumption
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance?.totalPurchased || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime purchases
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
                <Button onClick={() => window.location.href = '/dashboard/credits/checkout?type=RC'}>
                    <Plus className="mr-2 h-4 w-4" />
                    Purchase Credits
                </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                        Your recent credit usage and purchases
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No transactions found
                            </p>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {tx.type === 'PURCHASE' ? 'Credit Purchase' :
                                                tx.type === 'USAGE' ? 'Respondent Invite' : tx.type}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a')}
                                        </p>
                                        {tx.notes && (
                                            <p className="text-xs text-muted-foreground italic">
                                                {tx.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} RC
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
