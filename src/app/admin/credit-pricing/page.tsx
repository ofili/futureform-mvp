'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Force rebuild

interface CreditPackage {
    id: string;
    packageName: string;
    type: string;
    creditAmount: number;
    priceUSD: number;
    isActive: boolean;
    displayOrder: number;
}

export default function CreditPricingPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [deletingPackage, setDeletingPackage] = useState<CreditPackage | null>(null);
    const [formData, setFormData] = useState({
        packageName: '',
        type: 'RESPONDENT_BUNDLE',
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
            type: 'RESPONDENT_BUNDLE',
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
            type: pkg.type || 'CREDIT_BUNDLE',
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
            type: formData.type,
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
        setDeletingPackage(pkg);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingPackage) {
            deleteMutation.mutate(deletingPackage.id);
            setDeleteModalOpen(false);
            setDeletingPackage(null);
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
                <div className="flex gap-3">
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Package
                    </Button>
                </div>
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
                                        {pkg.creditAmount} {pkg.type === 'RESPONDENT_BUNDLE' ? 'respondents' : 'credits'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        ${calculatePerCredit(pkg.priceUSD, pkg.creditAmount)} per {pkg.type === 'RESPONDENT_BUNDLE' ? 'respondent' : 'credit'}
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
            )}

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

                    <form onSubmit={handleSubmit}>
                        <DialogBody className="space-y-4">
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

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="CREDIT_BUNDLE">Credit Bundle</option>
                                    <option value="RESPONDENT_BUNDLE">Respondent Bundle</option>
                                </select>
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
                                    Per {formData.type === 'RESPONDENT_BUNDLE' ? 'respondent' : 'credit'}: ${calculatePerCredit(parseFloat(formData.priceUSD), parseInt(formData.creditAmount))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="displayOrder">Display Order</Label>
                                <Input
                                    id="displayOrder"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
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
                        </DialogBody>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Package'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this package? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody>
                        {deletingPackage && (
                            <div className="space-y-2 py-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Package:</span>
                                    <span className="text-gray-900">{deletingPackage.packageName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Price:</span>
                                    <span className="text-gray-900">${deletingPackage.priceUSD}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Credits:</span>
                                    <span className="text-gray-900">{deletingPackage.creditAmount}</span>
                                </div>
                            </div>
                        )}
                    </DialogBody>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
