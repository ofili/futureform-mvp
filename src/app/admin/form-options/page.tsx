'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FormOption {
    id: string;
    category: string;
    value: string;
    label: string;
    displayOrder: number;
    isActive: boolean;
}

const CATEGORIES = [
    { value: 'sector', label: 'Sectors' },
    { value: 'region', label: 'Regions' },
    { value: 'department', label: 'Departments' },
    { value: 'relationship_stage', label: 'Relationship Stages' },
    { value: 'source', label: 'Sources' },
];

export default function FormOptionsPage() {
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState('sector');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<FormOption | null>(null);
    const [formData, setFormData] = useState({
        category: 'sector',
        value: '',
        label: '',
        displayOrder: 0,
        isActive: true
    });

    const { data: options, isLoading } = useQuery<FormOption[]>({
        queryKey: ['admin-form-options', selectedCategory],
        queryFn: async () => {
            const response = await fetch(`/api/v1/admin/form-options?category=${selectedCategory}`);
            if (!response.ok) throw new Error('Failed to fetch options');
            return response.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/form-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create option');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Option created successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-form-options'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to create option');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/form-options', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update option');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Option updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-form-options'] });
            setModalOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error('Failed to update option');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/v1/admin/form-options?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete option');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Option deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-form-options'] });
        },
        onError: () => {
            toast.error('Failed to delete option');
        }
    });

    const resetForm = () => {
        setFormData({
            category: selectedCategory,
            value: '',
            label: '',
            displayOrder: 0,
            isActive: true
        });
        setEditingOption(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (option: FormOption) => {
        setEditingOption(option);
        setFormData({
            category: option.category,
            value: option.value,
            label: option.label,
            displayOrder: option.displayOrder,
            isActive: option.isActive
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...(editingOption && { id: editingOption.id }),
            category: formData.category,
            value: formData.value,
            label: formData.label,
            displayOrder: formData.displayOrder,
            isActive: formData.isActive
        };

        if (editingOption) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (option: FormOption) => {
        if (confirm(`Are you sure you want to delete "${option.label}"?`)) {
            deleteMutation.mutate(option.id);
        }
    };

    const getCategoryLabel = (category: string) => {
        return CATEGORIES.find(c => c.value === category)?.label || category;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Form Options</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage dropdown options across the platform
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Category</CardTitle>
                        <NativeSelect
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-64"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </NativeSelect>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading options...</div>
                    ) : (
                        <div className="space-y-2">
                            {options?.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No options found for this category
                                </div>
                            ) : (
                                options?.map((option) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm text-muted-foreground w-8">
                                                #{option.displayOrder}
                                            </div>
                                            <div>
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Value: {option.value}
                                                </div>
                                            </div>
                                            {!option.isActive && (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(option)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(option)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingOption ? 'Edit Option' : 'Create New Option'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingOption ? 'Update option details' : 'Add a new form option'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <NativeSelect
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="label">Label *</Label>
                            <Input
                                id="label"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="e.g., Infrastructure"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">Value *</Label>
                            <Input
                                id="value"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="e.g., infrastructure"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Internal value (lowercase, use underscores)
                            </p>
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
                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Option'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
