'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface TierFeature {
    id: string;
    feature: string;
    displayOrder: number;
}

interface Tier {
    id: string;
    name: string;
    displayName: string;
    priceUSD: number | null;
    pricePeriod: string | null;
    creditsIncluded: number;
    bestFor: string | null;
    description: string | null;
    isActive: boolean;
    displayOrder: number;
    features: TierFeature[];
}

export default function TiersManagementPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<Tier | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        priceUSD: '',
        pricePeriod: '',
        creditsIncluded: '0',
        bestFor: '',
        description: '',
        isActive: true,
        displayOrder: 0,
        features: ['']
    });

    const { data: tiers, isLoading } = useQuery<Tier[]>({
        queryKey: ['admin-tiers'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/tiers');
            if (!response.ok) throw new Error('Failed to fetch tiers');
            return response.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/tiers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create tier');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Tier created successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-tiers'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to create tier');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/tiers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update tier');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Tier updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-tiers'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to update tier');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/v1/admin/tiers?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete tier');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Tier deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-tiers'] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const resetForm = () => {
        setFormData({
            name: '',
            displayName: '',
            priceUSD: '',
            pricePeriod: '',
            creditsIncluded: '0',
            bestFor: '',
            description: '',
            isActive: true,
            displayOrder: 0,
            features: ['']
        });
        setEditingTier(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (tier: Tier) => {
        setEditingTier(tier);
        setFormData({
            name: tier.name,
            displayName: tier.displayName,
            priceUSD: tier.priceUSD?.toString() || '',
            pricePeriod: tier.pricePeriod || '',
            creditsIncluded: tier.creditsIncluded.toString(),
            bestFor: tier.bestFor || '',
            description: tier.description || '',
            isActive: tier.isActive,
            displayOrder: tier.displayOrder,
            features: tier.features.map(f => f.feature)
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(editingTier && { id: editingTier.id }),
            name: formData.name,
            displayName: formData.displayName,
            priceUSD: formData.priceUSD ? parseFloat(formData.priceUSD) : null,
            pricePeriod: formData.pricePeriod || null,
            creditsIncluded: parseInt(formData.creditsIncluded),
            bestFor: formData.bestFor || null,
            description: formData.description || null,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
            features: formData.features.filter(f => f.trim() !== '')
        };

        if (editingTier) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (tier: Tier) => {
        if (confirm(`Are you sure you want to delete "${tier.displayName}"? This action cannot be undone.`)) {
            deleteMutation.mutate(tier.id);
        }
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription Tiers</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage pricing tiers and their features
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tier
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading tiers...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tiers?.map((tier) => (
                        <Card key={tier.id} className={!tier.isActive ? 'opacity-60' : ''}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {tier.displayName}
                                            {!tier.isActive && (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {tier.bestFor}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        {tier.priceUSD ? (
                                            <>
                                                <span className="text-3xl font-bold">
                                                    ${tier.priceUSD.toLocaleString()}
                                                </span>
                                                {tier.pricePeriod && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {tier.pricePeriod}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-3xl font-bold">Free</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <CreditCard className="h-4 w-4" />
                                        {tier.creditsIncluded} credits included
                                    </div>
                                </div>

                                {tier.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {tier.description}
                                    </p>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Features:</p>
                                    <ul className="space-y-1">
                                        {tier.features.map((feature) => (
                                            <li key={feature.id} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                {feature.feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEditModal(tier)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDelete(tier)}
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTier ? 'Edit Tier' : 'Create New Tier'}
                        </DialogTitle>
    const resetForm = () => {
                            setFormData({
                                name: '',
                                displayName: '',
                                priceUSD: '',
                                pricePeriod: '',
                                creditsIncluded: '0',
                                bestFor: '',
                                description: '',
                                isActive: true,
                                displayOrder: 0,
                                features: ['']
                            });
                        setEditingTier(null);
    };

    const openCreateModal = () => {
                            resetForm();
                        setModalOpen(true);
    };

    const openEditModal = (tier: Tier) => {
                            setEditingTier(tier);
                        setFormData({
                            name: tier.name,
                        displayName: tier.displayName,
                        priceUSD: tier.priceUSD?.toString() || '',
                        pricePeriod: tier.pricePeriod || '',
                        creditsIncluded: tier.creditsIncluded.toString(),
                        bestFor: tier.bestFor || '',
                        description: tier.description || '',
                        isActive: tier.isActive,
                        displayOrder: tier.displayOrder,
            features: tier.features.map(f => f.feature)
        });
                        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
                            e.preventDefault();

                        const data = {
                            ...(editingTier && { id: editingTier.id }),
                            name: formData.name,
                        displayName: formData.displayName,
                        priceUSD: formData.priceUSD ? parseFloat(formData.priceUSD) : null,
                        pricePeriod: formData.pricePeriod || null,
                        creditsIncluded: parseInt(formData.creditsIncluded),
                        bestFor: formData.bestFor || null,
                        description: formData.description || null,
                        isActive: formData.isActive,
                        displayOrder: formData.displayOrder,
            features: formData.features.filter(f => f.trim() !== '')
        };

                        if (editingTier) {
                            updateMutation.mutate(data);
        } else {
                            createMutation.mutate(data);
        }
    };

    const handleDelete = (tier: Tier) => {
        if (confirm(`Are you sure you want to delete "${tier.displayName}"? This action cannot be undone.`)) {
                            deleteMutation.mutate(tier.id);
        }
    };

    const addFeature = () => {
                            setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (index: number) => {
                            setFormData({
                                ...formData,
                                features: formData.features.filter((_, i) => i !== index)
                            });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
                        newFeatures[index] = value;
                        setFormData({...formData, features: newFeatures });
    };

                        return (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Subscription Tiers</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Manage pricing tiers and their features
                                    </p>
                                </div>
                                <Button onClick={openCreateModal}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Tier
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">Loading tiers...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tiers?.map((tier) => (
                                        <Card key={tier.id} className={!tier.isActive ? 'opacity-60' : ''}>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            {tier.displayName}
                                                            {!tier.isActive && (
                                                                <Badge variant="secondary">Inactive</Badge>
                                                            )}
                                                        </CardTitle>
                                                        <CardDescription className="mt-1">
                                                            {tier.bestFor}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        {tier.priceUSD ? (
                                                            <>
                                                                <span className="text-3xl font-bold">
                                                                    ${tier.priceUSD.toLocaleString()}
                                                                </span>
                                                                {tier.pricePeriod && (
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {tier.pricePeriod}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-3xl font-bold">Free</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                        <CreditCard className="h-4 w-4" />
                                                        {tier.creditsIncluded} credits included
                                                    </div>
                                                </div>

                                                {tier.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {tier.description}
                                                    </p>
                                                )}

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Features:</p>
                                                    <ul className="space-y-1">
                                                        {tier.features.map((feature) => (
                                                            <li key={feature.id} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                <span className="text-primary mt-1">•</span>
                                                                {feature.feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex gap-2 pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => openEditModal(tier)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDelete(tier)}
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
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingTier ? 'Edit Tier' : 'Create New Tier'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingTier ? 'Update tier details and features' : 'Add a new subscription tier'}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit}>
                                        <DialogBody className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Internal Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="e.g., framework_access"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="displayName">Display Name *</Label>
                                                    <Input
                                                        id="displayName"
                                                        value={formData.displayName}
                                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                        placeholder="e.g., Framework Access"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="priceUSD">Price (USD)</Label>
                                                    <Input
                                                        id="priceUSD"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.priceUSD}
                                                        onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                                                        placeholder="Leave empty for free"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="pricePeriod">Price Period</Label>
                                                    <Input
                                                        id="pricePeriod"
                                                        value={formData.pricePeriod}
                                                        onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                                                        placeholder="e.g., per assessment, annual"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="creditsIncluded">Credits Included *</Label>
                                                    <Input
                                                        id="creditsIncluded"
                                                        type="number"
                                                        value={formData.creditsIncluded}
                                                        onChange={(e) => setFormData({ ...formData, creditsIncluded: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="displayOrder">Display Order</Label>
                                                    <Input
                                                        id="displayOrder"
                                                        type="number"
                                                        value={formData.displayOrder}
                                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bestFor">Best For</Label>
                                                <Input
                                                    id="bestFor"
                                                    value={formData.bestFor}
                                                    onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                                                    placeholder="e.g., DIY capacity building"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Brief description of this tier"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <Label>Features</Label>
                                                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Feature
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {formData.features.map((feature, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                value={feature}
                                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                                placeholder="Feature description"
                                                            />
                                                            {formData.features.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => removeFeature(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
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
                                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Tier'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        );
}
