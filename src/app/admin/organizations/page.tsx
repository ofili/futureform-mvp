'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building, Search, Edit, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Organization {
    id: string;
    name: string;
    type: string;
    region: string;
    country: string | null;
    relationshipStage: string;
    tier: {
        id: string;
        displayName: string;
    } | null;
    members: any[];
    projects: any[];
    credits: { amount: number }[];
    createdAt: string;
}

export default function OrganizationsPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

    const { data: organizations, isLoading } = useQuery<Organization[]>({
        queryKey: ['admin-organizations', searchTerm, stageFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (stageFilter) params.append('stage', stageFilter);

            const response = await fetch(`/api/v1/admin/organizations?${params}`);
            if (!response.ok) throw new Error('Failed to fetch organizations');
            return response.json();
        }
    });

    const { data: tiers } = useQuery<{ id: string; displayName: string }[]>({
        queryKey: ['subscription-tiers'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/tiers');
            if (!response.ok) throw new Error('Failed to fetch tiers');
            return response.json();
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/admin/organizations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update organization');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Organization updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
            setEditModalOpen(false);
        },
        onError: () => {
            toast.error('Failed to update organization');
        }
    });

    const openEditModal = (org: Organization) => {
        setSelectedOrg(org);
        setEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrg) return;

        const formData = new FormData(e.target as HTMLFormElement);
        updateMutation.mutate({
            id: selectedOrg.id,
            relationshipStage: formData.get('relationshipStage'),
            pilotAgreementSigned: formData.get('pilotAgreementSigned') === 'on',
            caseStudyApproval: formData.get('caseStudyApproval') === 'on',
            tierId: formData.get('tierId') || null
        });
    };

    const getStageColor = (stage: string) => {
        const colors: Record<string, string> = {
            'Lead': 'bg-gray-500',
            'Contacted': 'bg-blue-500',
            'Discovery': 'bg-yellow-500',
            'Pilot': 'bg-orange-500',
            'Active Client': 'bg-green-500',
            'Churned': 'bg-red-500'
        };
        return colors[stage] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Organizations', current: true }
                ]}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage all platform organizations
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search organizations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <NativeSelect
                                value={stageFilter}
                                onChange={(e) => setStageFilter(e.target.value)}
                            >
                                <option value="">All Stages</option>
                                <option value="Lead">Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Discovery">Discovery</option>
                                <option value="Pilot">Pilot</option>
                                <option value="Active Client">Active Client</option>
                                <option value="Churned">Churned</option>
                            </NativeSelect>
                        </div>
                    </CardContent>
                </Card >

                {
                    isLoading ? (
                        <div className="text-center py-8" > Loading organizations...</div>
                    ) : (
                        <div className="space-y-4">
                            {organizations?.map((org) => (
                                <Card key={org.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Building className="h-5 w-5 text-muted-foreground" />
                                                    <h3 className="text-lg font-semibold">{org.name}</h3>
                                                    <Badge className={getStageColor(org.relationshipStage)}>
                                                        {org.relationshipStage}
                                                    </Badge>
                                                    {org.tier && (
                                                        <Badge variant="outline">{org.tier.displayName}</Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                                    <div>
                                                        <div className="text-muted-foreground">Type</div>
                                                        <div className="font-medium">{org.type}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Region</div>
                                                        <div className="font-medium">{org.region}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            Members
                                                        </div>
                                                        <div className="font-medium">{org.members.length}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground flex items-center gap-1">
                                                            <CreditCard className="h-3 w-3" />
                                                            Credits
                                                        </div>
                                                        <div className="font-medium">
                                                            {org.credits[0]?.amount || 0}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground mt-3">
                                                    Created: {new Date(org.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(org)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {organizations?.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No organizations found
                                </div>
                            )}
                        </div>
                    )
                }

                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Organization</DialogTitle>
                        </DialogHeader>

                        {selectedOrg && (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Organization</Label>
                                    <div className="font-medium">{selectedOrg.name}</div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="relationshipStage">Relationship Stage</Label>
                                    <NativeSelect
                                        id="relationshipStage"
                                        name="relationshipStage"
                                        defaultValue={selectedOrg.relationshipStage}
                                    >
                                        <option value="Lead">Lead</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Discovery">Discovery</option>
                                        <option value="Pilot">Pilot</option>
                                        <option value="Active Client">Active Client</option>
                                        <option value="Churned">Churned</option>
                                    </NativeSelect>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tierId">Subscription Tier</Label>
                                    <NativeSelect
                                        id="tierId"
                                        name="tierId"
                                        defaultValue={selectedOrg.tier?.id || ''}
                                    >
                                        <option value="">No Tier</option>
                                        {tiers?.map((tier) => (
                                            <option key={tier.id} value={tier.id}>
                                                {tier.displayName}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="pilotAgreementSigned"
                                            defaultChecked={false}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Pilot Agreement Signed</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="caseStudyApproval"
                                            defaultChecked={false}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Case Study Approval</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div >
        </div >
    );
}
