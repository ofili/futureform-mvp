'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { AlertTriangle, Pencil, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface VetoCriterion {
    id: string;
    vetoId: string;
    name: string;
    description: string;
    layer: string;
    subDimension: string;
    thresholdValue: number | null;
    thresholdDescription: string;
    action: string;
    severity: string;
    isActive: boolean;
}

export function VetoCriteriaManager() {
    const [criteria, setCriteria] = useState<VetoCriterion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCriterion, setEditingCriterion] = useState<VetoCriterion | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchCriteria();
    }, []);

    const fetchCriteria = async () => {
        try {
            const res = await fetch('/api/v1/admin/trust/veto-criteria');
            const data = await res.json();
            if (data.success) {
                setCriteria(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch veto criteria');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingCriterion) return;

        try {
            const method = editingCriterion.id ? 'PUT' : 'POST';
            const res = await fetch('/api/v1/admin/trust/veto-criteria', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCriterion),
            });

            if (res.ok) {
                toast.success('Veto criterion saved');
                fetchCriteria();
                setIsDialogOpen(false);
                setEditingCriterion(null);
            } else {
                toast.error('Failed to save');
            }
        } catch (error) {
            toast.error('Failed to save veto criterion');
        }
    };

    const handleToggleActive = async (criterion: VetoCriterion) => {
        try {
            const res = await fetch('/api/v1/admin/trust/veto-criteria', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: criterion.id,
                    isActive: !criterion.isActive,
                }),
            });

            if (res.ok) {
                toast.success(`Criterion ${criterion.isActive ? 'deactivated' : 'activated'}`);
                fetchCriteria();
            }
        } catch (error) {
            toast.error('Failed to update criterion');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'destructive';
            case 'HIGH': return 'default';
            default: return 'secondary';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading veto criteria...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Veto Criteria</h3>
                    <p className="text-sm text-muted-foreground">
                        Define conditions that trigger "DO NOT PROCEED" recommendations
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCriterion({
                            id: '',
                            vetoId: '',
                            name: '',
                            description: '',
                            layer: 'L1',
                            subDimension: '',
                            thresholdValue: null,
                            thresholdDescription: '',
                            action: 'DO NOT PROCEED',
                            severity: 'CRITICAL',
                            isActive: true,
                        });
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Criterion
                </Button>
            </div>

            <div className="grid gap-4">
                {criteria.map((criterion) => (
                    <Card
                        key={criterion.id}
                        className={`${!criterion.isActive ? 'opacity-50' : ''}`}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-destructive" />
                                    <CardTitle className="text-base">{criterion.name}</CardTitle>
                                    <Badge variant="outline">{criterion.layer}</Badge>
                                    <Badge variant={getSeverityColor(criterion.severity) as any}>
                                        {criterion.severity}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={criterion.isActive}
                                        onCheckedChange={() => handleToggleActive(criterion)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingCriterion(criterion);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Threshold:</span>
                                    <p className="font-medium">{criterion.thresholdDescription}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Action:</span>
                                    <p className="font-medium text-destructive">{criterion.action}</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {criterion.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCriterion?.id ? 'Edit Veto Criterion' : 'Add Veto Criterion'}
                        </DialogTitle>
                        <DialogDescription>
                            Define conditions that automatically flag assessments as DO NOT PROCEED
                        </DialogDescription>
                    </DialogHeader>

                    {editingCriterion && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Veto ID</label>
                                    <Input
                                        value={editingCriterion.vetoId}
                                        onChange={(e) => setEditingCriterion({
                                            ...editingCriterion,
                                            vetoId: e.target.value,
                                        })}
                                        placeholder="L1_Veto_Example"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Layer</label>
                                    <Input
                                        value={editingCriterion.layer}
                                        onChange={(e) => setEditingCriterion({
                                            ...editingCriterion,
                                            layer: e.target.value,
                                        })}
                                        placeholder="L1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={editingCriterion.name}
                                    onChange={(e) => setEditingCriterion({
                                        ...editingCriterion,
                                        name: e.target.value,
                                    })}
                                    placeholder="Sub-dimension name"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Threshold Description</label>
                                <Input
                                    value={editingCriterion.thresholdDescription}
                                    onChange={(e) => setEditingCriterion({
                                        ...editingCriterion,
                                        thresholdDescription: e.target.value,
                                    })}
                                    placeholder="<2.0 (below 40%)"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description / Rationale</label>
                                <Textarea
                                    value={editingCriterion.description}
                                    onChange={(e) => setEditingCriterion({
                                        ...editingCriterion,
                                        description: e.target.value,
                                    })}
                                    placeholder="Why this criterion triggers a veto"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Criterion</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
