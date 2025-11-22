'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, CreditCard, Plus, Minus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SelectValue = SelectPrimitive.Value;

interface Transaction {
    id: string;
    type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'EXPIRE';
    creditsChange: number;
    notes: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    credit: {
        organization: {
            id: string;
            name: string;
        };
    };
}

export default function BillingPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isReconcileOpen, setIsReconcileOpen] = useState(false);

    // Reconciliation Form State
    const [orgId, setOrgId] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('PURCHASE');
    const [notes, setNotes] = useState('');

    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['admin-billing-transactions'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/billing/transactions');
            const result = await response.json();
            return result.data;
        },
    });

    // Fetch organizations for the dropdown
    const { data: organizations } = useQuery({
        queryKey: ['admin-organizations-list'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/organizations'); // Assuming this exists or similar
            const result = await response.json();
            return result.data;
        },
    });

    const reconcileMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/billing/reconcile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to reconcile');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-billing-transactions'] });
            setIsReconcileOpen(false);
            setOrgId('');
            setAmount('');
            setNotes('');
            toast.success('Transaction recorded successfully');
        },
        onError: () => {
            toast.error('Failed to record transaction');
        },
    });

    const handleReconcile = () => {
        if (!orgId || !amount || !type) {
            toast.error('Please fill in all required fields');
            return;
        }

        reconcileMutation.mutate({
            organizationId: orgId,
            amount: parseInt(amount),
            type,
            notes,
        });
    };

    const filteredTransactions = transactions?.filter((tx) =>
        tx.credit.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PURCHASE': return 'bg-green-100 text-green-800';
            case 'USAGE': return 'bg-blue-100 text-blue-800';
            case 'REFUND': return 'bg-yellow-100 text-yellow-800';
            case 'EXPIRE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Reconciliation</h1>
                    <p className="text-muted-foreground">Monitor transactions and manage credit adjustments.</p>
                </div>
                <Button onClick={() => setIsReconcileOpen(true)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Manual Reconciliation
                </Button>
                <Dialog open={isReconcileOpen} onOpenChange={setIsReconcileOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manual Credit Adjustment</DialogTitle>
                            <DialogDescription>
                                Manually add or remove credits for an organization.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="org">Organization</Label>
                                <Select value={orgId} onValueChange={setOrgId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations?.map((org: any) => (
                                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PURCHASE">Purchase (Add)</SelectItem>
                                            <SelectItem value="REFUND">Refund (Add)</SelectItem>
                                            <SelectItem value="USAGE">Usage (Deduct)</SelectItem>
                                            <SelectItem value="EXPIRE">Expire (Deduct)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="e.g. 100"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Reason for adjustment..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsReconcileOpen(false)}>Cancel</Button>
                            <Button onClick={handleReconcile} disabled={reconcileMutation.isPending}>
                                {reconcileMutation.isPending ? 'Processing...' : 'Confirm Adjustment'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Transaction History</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search transactions..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredTransactions?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No transactions found.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Organization</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions?.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell className="font-medium">{tx.credit.organization.name}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">{tx.user.firstName} {tx.user.lastName}</div>
                                                <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getTypeColor(tx.type)}>
                                                    {tx.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`font-mono font-medium ${tx.creditsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.creditsChange > 0 ? '+' : ''}{tx.creditsChange}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={tx.notes}>
                                                {tx.notes}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
