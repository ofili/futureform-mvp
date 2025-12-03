'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, History, CreditCard, Zap, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ECBalance, ECTransaction } from '@/services/credits/ec.service';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ECDashboardProps {
    organizationId: string;
}

export function ECDashboard({ organizationId }: ECDashboardProps) {
    const [balance, setBalance] = useState<ECBalance | null>(null);
    const [transactions, setTransactions] = useState<ECTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [autoReloadOpen, setAutoReloadOpen] = useState(false);
    const [reloadThreshold, setReloadThreshold] = useState('100');
    const [reloadAmount, setReloadAmount] = useState('500');
    const [savingAutoReload, setSavingAutoReload] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [balanceRes, txRes] = await Promise.all([
                fetch(`/api/v1/credits/ec/balance?organizationId=${organizationId}`),
                fetch(`/api/v1/credits/ec/transactions?organizationId=${organizationId}&limit=10`)
            ]);

            if (!balanceRes.ok || !txRes.ok) throw new Error('Failed to fetch data');

            const balanceData = await balanceRes.json();
            const txData = await txRes.json();

            setBalance(balanceData);
            setTransactions(txData);

            if (balanceData.autoReloadThreshold) {
                setReloadThreshold(balanceData.autoReloadThreshold.toString());
            }
            if (balanceData.autoReloadAmount) {
                setReloadAmount(balanceData.autoReloadAmount.toString());
            }
        } catch (error) {
            console.error('Error fetching EC data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load credit data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAutoReloadSave = async () => {
        try {
            setSavingAutoReload(true);
            const res = await fetch('/api/v1/credits/ec/auto-reload/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationId,
                    threshold: parseFloat(reloadThreshold),
                    reloadAmount: parseFloat(reloadAmount),
                    enabled: true
                }),
            });

            if (!res.ok) throw new Error('Failed to save settings');

            toast({
                title: 'Success',
                description: 'Auto-reload settings updated successfully.',
            });

            setAutoReloadOpen(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error saving auto-reload:', error);
            toast({
                title: 'Error',
                description: 'Failed to save auto-reload settings.',
                variant: 'destructive',
            });
        } finally {
            setSavingAutoReload(false);
        }
    };

    const toggleAutoReload = async (enabled: boolean) => {
        if (enabled) {
            setAutoReloadOpen(true);
            return;
        }

        try {
            const res = await fetch('/api/v1/credits/ec/auto-reload/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationId,
                    enabled: false
                }),
            });

            if (!res.ok) throw new Error('Failed to disable auto-reload');

            toast({
                title: 'Success',
                description: 'Auto-reload disabled.',
            });

            fetchData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to disable auto-reload.',
                variant: 'destructive',
            });
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
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseFloat(balance?.totalAvailable?.toString() || '0').toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Evidence Credits (EC)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Used</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseFloat(balance?.totalUsed?.toString() || '0').toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime consumption
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Auto-Reload</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={balance?.autoReloadEnabled}
                                onCheckedChange={toggleAutoReload}
                            />
                            <Label>{balance?.autoReloadEnabled ? 'Enabled' : 'Disabled'}</Label>
                        </div>
                        {balance?.autoReloadEnabled && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Adds {balance.autoReloadAmount} EC when below {balance.autoReloadThreshold} EC
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setAutoReloadOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Auto-Reload
                </Button>
                <Button onClick={() => window.location.href = '/pricing'}>
                    <Plus className="mr-2 h-4 w-4" />
                    Purchase Credits
                </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                        Your recent evidence credit usage and purchases
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
                                                tx.type === 'USAGE' ? `Evidence Submission (${tx.evidenceType || 'Unknown'})` :
                                                    tx.type === 'AUTO_RELOAD' ? 'Auto-Reload' : tx.type}
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
                                    <div className={`font-medium ${parseFloat(tx.amount.toString()) > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {parseFloat(tx.amount.toString()) > 0 ? '+' : ''}{parseFloat(tx.amount.toString()).toFixed(2)} EC
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Auto-Reload Dialog */}
            <Dialog open={autoReloadOpen} onOpenChange={setAutoReloadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure Auto-Reload</DialogTitle>
                        <DialogDescription>
                            Automatically purchase credits when your balance runs low to ensure uninterrupted service.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="threshold" className="text-right">
                                Threshold
                            </Label>
                            <Input
                                id="threshold"
                                type="number"
                                value={reloadThreshold}
                                onChange={(e) => setReloadThreshold(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={reloadAmount}
                                onChange={(e) => setReloadAmount(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAutoReloadOpen(false)}>Cancel</Button>
                        <Button onClick={handleAutoReloadSave} disabled={savingAutoReload}>
                            {savingAutoReload && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
