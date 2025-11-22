'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface CreditPackage {
    id: string;
    packageName: string;
    creditAmount: number;
    priceUSD: number;
    isActive: boolean;
    displayOrder: number;
}

export default function CreditPricingPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [formData, setFormData] = useState({
        packageName: '',
        creditAmount: '',
        priceUSD: '',
        isActive: true,
        displayOrder: 0
    });

    const { data: packages, isLoading } = useQuery<CreditPackage[]>({
        queryKey: ['admin-credit-pricing'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/credit-pricing');
            if (!response.ok) throw new Error('Failed to fetch packages');
            return response.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/credit-pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create package');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Package created successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-credit-pricing'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to create package');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/credit-pricing', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update package');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Package updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-credit-pricing'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to update package');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/v1/admin/credit-pricing?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete package');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Package deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-credit-pricing'] });
        },
        onError: () => {
            toast.error('Failed to delete package');
        }
    });

    const resetForm = () => {
        setFormData({
            packageName: '',
            creditAmount: '',
            priceUSD: '',
            isActive: true,
            displayOrder: 0
        });
        setEditingPackage(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (pkg: CreditPackage) => {
        setEditingPackage(pkg);
        setFormData({
            packageName: pkg.packageName,
            creditAmount: pkg.creditAmount.toString(),
            priceUSD: pkg.priceUSD.toString(),
            isActive: pkg.isActive,
            displayOrder: pkg.displayOrder
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(editingPackage && { id: editingPackage.id }),
            packageName: formData.packageName,
            creditAmount: parseInt(formData.creditAmount),
            priceUSD: parseFloat(formData.priceUSD),
            isActive: formData.isActive,
            displayOrder: formData.displayOrder
        };

        if (editingPackage) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (pkg: CreditPackage) => {
        if (confirm(`Are you sure you want to delete "${pkg.packageName}"?`)) {
            deleteMutation.mutate(pkg.id);
        }
    };

    const calculatePerCredit = (priceUSD: number, creditAmount: number) => {
        return (priceUSD / creditAmount).toFixed(2);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credit Pricing</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage credit packages and pricing
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Package
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading packages...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages?.map((pkg) => (
                        <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="flex items-center gap-2">
                                        {pkg.packageName}
                                        {!pkg.isActive && (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-3xl font-bold">
                                        ${pkg.priceUSD.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {pkg.creditAmount} credits
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        ${calculatePerCredit(pkg.priceUSD, pkg.creditAmount)} per credit
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEditModal(pkg)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDelete(pkg)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
            }

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingPackage ? 'Edit Package' : 'Create New Package'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPackage ? 'Update package details' : 'Add a new credit package'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="packageName">Package Name *</Label>
                            <Input
                                id="packageName"
                                value={formData.packageName}
                                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                                placeholder="e.g., Single Assessment"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="creditAmount">Credits *</Label>
                                <Input
                                    id="creditAmount"
                                    type="number"
                                    value={formData.creditAmount}
                                    onChange={(e) => setFormData({ ...formData, creditAmount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceUSD">Price (USD) *</Label>
                                <Input
                                    id="priceUSD"
                                    type="number"
                                    step="0.01"
                                    value={formData.priceUSD}
                                    onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {formData.creditAmount && formData.priceUSD && (
                            <div className="text-sm text-muted-foreground">
                                Per credit: ${calculatePerCredit(parseFloat(formData.priceUSD), parseInt(formData.creditAmount))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="displayOrder">Display Order</Label>
                            <Input
                                id="displayOrder"
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Package'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
