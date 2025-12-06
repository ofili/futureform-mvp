'use client';

import React, { useState } from 'react';
import { TrustLayerWithSubDimensions } from '@/types/trust';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditLayerDialogProps {
    layer: TrustLayerWithSubDimensions;
    onUpdate?: () => void;
}

export function EditLayerDialog({ layer, onUpdate }: EditLayerDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        baselineWeight: layer.baselineWeight,
        description: layer.description || '',
    });

    const handleOpen = () => {
        setFormData({
            baselineWeight: layer.baselineWeight,
            description: layer.description || '',
        });
        setIsOpen(true);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/v1/admin/trust/layers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    layerId: layer.layerId,
                    baselineWeight: formData.baselineWeight,
                    description: formData.description,
                }),
            });

            if (res.ok) {
                toast.success(`${layer.name} updated successfully`);
                setIsOpen(false);
                onUpdate?.();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update layer');
            }
        } catch (error) {
            toast.error('Failed to update layer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleOpen}
                title="Edit layer"
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit {layer.name}</DialogTitle>
                        <DialogDescription>
                            Update layer weight and description
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <label className="text-sm font-medium">Layer ID</label>
                            <Input
                                value={layer.layerId}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Baseline Weight</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={formData.baselineWeight}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        baselineWeight: parseFloat(e.target.value) || 0,
                                    })}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">
                                    ({(formData.baselineWeight * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All layer weights should sum to 1.0 (100%)
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })}
                                placeholder="Describe this trust layer..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
