'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface ExchangeRate {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    rate: string; // Decimal comes as string from API usually
    updatedAt: string;
    updatedByUser: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export default function ExchangeRatesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [rates, setRates] = useState<ExchangeRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);
    const [formData, setFormData] = useState({
        fromCurrency: 'USD',
        toCurrency: 'NGN',
        rate: '',
    });

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/admin/exchange-rates');
            if (!response.ok) throw new Error('Failed to fetch rates');
            const data = await response.json();
            setRates(data.data);
        } catch (error) {
            toast.error('Failed to load exchange rates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/admin/exchange-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromCurrency: formData.fromCurrency,
                    toCurrency: formData.toCurrency,
                    rate: parseFloat(formData.rate),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save rate');
            }

            toast.success('Exchange rate saved successfully');
            setIsDialogOpen(false);
            setEditingRate(null);
            setFormData({ fromCurrency: 'USD', toCurrency: 'NGN', rate: '' });
            fetchRates();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exchange rate?')) return;

        try {
            const response = await fetch(`/api/v1/admin/exchange-rates?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete rate');

            toast.success('Exchange rate deleted');
            fetchRates();
        } catch (error) {
            toast.error('Failed to delete rate');
        }
    };

    const handleEdit = (rate: ExchangeRate) => {
        setEditingRate(rate);
        setFormData({
            fromCurrency: rate.fromCurrency,
            toCurrency: rate.toCurrency,
            rate: rate.rate.toString(),
        });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Exchange Rates</h1>
                        <p className="text-muted-foreground">
                            Manage currency conversion rates for billing.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingRate(null);
                                setFormData({ fromCurrency: 'USD', toCurrency: 'NGN', rate: '' });
                            }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Rate
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingRate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fromCurrency">From Currency</Label>
                                        <Input
                                            id="fromCurrency"
                                            value={formData.fromCurrency}
                                            onChange={(e) => setFormData({ ...formData, fromCurrency: e.target.value.toUpperCase() })}
                                            placeholder="USD"
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="toCurrency">To Currency</Label>
                                        <Input
                                            id="toCurrency"
                                            value={formData.toCurrency}
                                            onChange={(e) => setFormData({ ...formData, toCurrency: e.target.value.toUpperCase() })}
                                            placeholder="NGN"
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rate">Exchange Rate</Label>
                                    <Input
                                        id="rate"
                                        type="number"
                                        step="0.0001"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        placeholder="e.g. 1500.50"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        1 {formData.fromCurrency || 'Unit'} = {formData.rate || '...'} {formData.toCurrency || 'Unit'}
                                    </p>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Rate</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Currency Pair</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Updated By</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : rates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No exchange rates configured.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rates.map((rate) => (
                                    <TableRow key={rate.id}>
                                        <TableCell className="font-medium">
                                            {rate.fromCurrency} → {rate.toCurrency}
                                        </TableCell>
                                        <TableCell>{Number(rate.rate).toFixed(4)}</TableCell>
                                        <TableCell>{format(new Date(rate.updatedAt), 'MMM d, yyyy HH:mm')}</TableCell>
                                        <TableCell>
                                            {rate.updatedByUser.firstName} {rate.updatedByUser.lastName}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(rate)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(rate.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
