'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Pencil, Plus, Trash2, Scale } from 'lucide-react';
import { toast } from 'sonner';

interface SectorWeight {
    id: string;
    sector: string;
    layerWeights: Record<string, number>;
    rationale: string;
    createdAt: string;
    updatedAt: string;
}

const LAYER_NAMES: Record<string, string> = {
    L1_Reliability: 'L1: Reliability',
    L2_Transparency: 'L2: Transparency',
    L3_Governance: 'L3: Governance',
    L4_Competence: 'L4: Competence',
    L5_Integrity: 'L5: Integrity',
    L6_Ecosystem: 'L6: Ecosystem',
};

export function SectorWeightManager() {
    const [sectorWeights, setSectorWeights] = useState<SectorWeight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingWeight, setEditingWeight] = useState<SectorWeight | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchSectorWeights();
    }, []);

    const fetchSectorWeights = async () => {
        try {
            const res = await fetch('/api/v1/admin/trust/sector-weights');
            const data = await res.json();
            if (data.success) {
                setSectorWeights(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch sector weights');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingWeight) return;

        // Validate weights sum to 1.0
        const total = Object.values(editingWeight.layerWeights).reduce((sum, w) => sum + w, 0);
        if (Math.abs(total - 1.0) > 0.01) {
            toast.error(`Weights must sum to 1.0 (current: ${total.toFixed(2)})`);
            return;
        }

        try {
            const method = editingWeight.id ? 'PUT' : 'POST';
            const res = await fetch('/api/v1/admin/trust/sector-weights', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingWeight),
            });

            if (res.ok) {
                toast.success('Sector weight saved');
                fetchSectorWeights();
                setIsDialogOpen(false);
                setEditingWeight(null);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch (error) {
            toast.error('Failed to save sector weight');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sector configuration?')) return;

        try {
            const res = await fetch(`/api/v1/admin/trust/sector-weights?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Sector weight deleted');
                fetchSectorWeights();
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const updateLayerWeight = (layer: string, value: number) => {
        if (!editingWeight) return;
        setEditingWeight({
            ...editingWeight,
            layerWeights: {
                ...editingWeight.layerWeights,
                [layer]: value,
            },
        });
    };

    const getDefaultWeights = (): Record<string, number> => ({
        L1_Reliability: 0.20,
        L2_Transparency: 0.15,
        L3_Governance: 0.15,
        L4_Competence: 0.20,
        L5_Integrity: 0.15,
        L6_Ecosystem: 0.15,
    });

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading sector weights...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Sector Weight Adjustments</h3>
                    <p className="text-sm text-muted-foreground">
                        Override baseline layer weights for specific contexts
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingWeight({
                            id: '',
                            sector: '',
                            layerWeights: getDefaultWeights(),
                            rationale: '',
                            createdAt: '',
                            updatedAt: '',
                        });
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sector
                </Button>
            </div>

            <div className="grid gap-4">
                {sectorWeights.map((sw) => (
                    <Card key={sw.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">{sw.sector}</CardTitle>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingWeight(sw);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(sw.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {Object.entries(sw.layerWeights).map(([layer, weight]) => (
                                    <Badge key={layer} variant="secondary">
                                        {layer.split('_')[0]}: {(weight * 100).toFixed(0)}%
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{sw.rationale}</p>
                        </CardContent>
                    </Card>
                ))}

                {sectorWeights.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        No sector-specific weight adjustments configured.
                        All assessments use baseline weights.
                    </p>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingWeight?.id ? 'Edit Sector Weights' : 'Add Sector Configuration'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure layer weight adjustments for this context
                        </DialogDescription>
                    </DialogHeader>

                    {editingWeight && (
                        <div className="grid gap-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Sector / Context Name</label>
                                <Input
                                    value={editingWeight.sector}
                                    onChange={(e) => setEditingWeight({
                                        ...editingWeight,
                                        sector: e.target.value,
                                    })}
                                    placeholder="e.g., Emerging Market Deployment"
                                    disabled={!!editingWeight.id}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Layer Weights (must sum to 100%)
                                </label>
                                {Object.keys(getDefaultWeights()).map((layer) => (
                                    <div key={layer} className="flex items-center gap-3">
                                        <span className="w-32 text-sm">
                                            {LAYER_NAMES[layer] || layer}
                                        </span>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={editingWeight.layerWeights[layer] || 0}
                                            onChange={(e) => updateLayerWeight(layer, parseFloat(e.target.value) || 0)}
                                            className="w-24"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {((editingWeight.layerWeights[layer] || 0) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                                    <span>Total:</span>
                                    <span className={
                                        Math.abs(Object.values(editingWeight.layerWeights).reduce((s, w) => s + w, 0) - 1.0) > 0.01
                                            ? 'text-destructive'
                                            : 'text-green-600'
                                    }>
                                        {(Object.values(editingWeight.layerWeights).reduce((s, w) => s + w, 0) * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Rationale</label>
                                <Textarea
                                    value={editingWeight.rationale}
                                    onChange={(e) => setEditingWeight({
                                        ...editingWeight,
                                        rationale: e.target.value,
                                    })}
                                    placeholder="Why these weights are adjusted for this context"
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Configuration</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
