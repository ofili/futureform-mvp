'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/native-select';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface FormOption {
    id: string;
    value: string;
    label: string;
    displayOrder: number;
}

export default function OrganizationSettingsPage() {
    const user = useAuthStore((s) => s.user);
    const queryClient = useQueryClient();
    const canEdit = user?.role === 'ADMIN' || ['ADMIN', 'OWNER'].includes(user?.organizationRole || '');

    const { data: organization, isLoading } = useQuery({
        queryKey: ['organization-settings'],
        queryFn: async () => {
            const response = await fetch('/api/v1/organization/settings');
            if (!response.ok) throw new Error('Failed to fetch organization settings');
            return response.json();
        }
    });

    const [formData, setFormData] = useState<any>({});

    // Update form data when organization loads
    useEffect(() => {
        if (organization) {
            setFormData(organization);
        }
    }, [organization]);

    // Fetch credits balance
    const { data: credits } = useQuery({
        queryKey: ['organization-credits'],
        queryFn: async () => {
            const response = await fetch('/api/v1/billing/credits');
            if (!response.ok) return { balance: 0 };
            return response.json();
        }
    });

    // Fetch form options
    const { data: sectors = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', 'sector'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/form-options?category=sector');
            if (!response.ok) return [];
            return response.json();
        }
    });

    const { data: regions = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', 'region'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/form-options?category=region');
            if (!response.ok) return [];
            return response.json();
        }
    });

    const { data: relationshipStages = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', 'relationship_stage'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/form-options?category=relationship_stage');
            if (!response.ok) return [];
            return response.json();
        }
    });

    const { data: sources = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', 'source'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/form-options?category=source');
            if (!response.ok) return [];
            return response.json();
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/v1/organization/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update settings');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Organization settings updated');
            queryClient.invalidateQueries({ queryKey: ['organization-settings'] });
        },
        onError: (error) => {
            toast.error('Failed to update settings', { description: error.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="text-center py-8">Loading organization settings...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your organization's profile and preferences.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                            <CardDescription>
                                Basic information about your organization.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!canEdit}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input
                                        id="type"
                                        value={formData.type || ''}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sectorFocus">Sector Focus</Label>
                                    <NativeSelect
                                        id="sectorFocus"
                                        value={formData.sectorFocus || ''}
                                        onChange={(e) => setFormData({ ...formData, sectorFocus: e.target.value })}
                                        disabled={!canEdit}
                                    >
                                        <option value="">Select Sector</option>
                                        {sectors.map(sector => (
                                            <option key={sector.id} value={sector.value}>{sector.label}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region *</Label>
                                    <NativeSelect
                                        id="region"
                                        value={formData.region || ''}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        disabled={!canEdit}
                                        required
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map(region => (
                                            <option key={region.id} value={region.value}>{region.label}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country || ''}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={formData.website || ''}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Brief description of your organization..."
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    disabled={!canEdit}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>
                                Your current subscription tier and credits.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label>Current Tier</Label>
                                    <div className="mt-2">
                                        <Badge variant="secondary" className="text-sm">
                                            {organization?.tier?.name || 'Framework Access'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label>Assessment Credits</Label>
                                    <div className="mt-2">
                                        <span className="text-2xl font-bold">
                                            {credits?.balance ?? 0}
                                        </span>
                                        <span className="text-sm text-muted-foreground ml-2">credits</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link href="/dashboard/credits">
                                    <Button variant="outline">
                                        Manage Subscription
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Relationship Info (Internal Tracking) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Relationship Information</CardTitle>
                            <CardDescription>
                                Internal tracking information (for FutureForm team use).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="relationshipStage">Relationship Stage</Label>
                                    <NativeSelect
                                        id="relationshipStage"
                                        value={formData.relationshipStage || 'Discovery'}
                                        onChange={(e) => setFormData({ ...formData, relationshipStage: e.target.value })}
                                        disabled={!canEdit}
                                    >
                                        <option value="">Select Relationship Stage</option>
                                        {relationshipStages.map(stage => (
                                            <option key={stage.id} value={stage.value}>{stage.label}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="source">Source</Label>
                                    <NativeSelect
                                        id="source"
                                        value={formData.source || ''}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        disabled={!canEdit}
                                    >
                                        <option value="">Select Source</option>
                                        {sources.map(source => (
                                            <option key={source.id} value={source.value}>{source.label}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            </div>

                            {formData.source === 'Referral' && (
                                <div className="space-y-2">
                                    <Label htmlFor="referralSource">Referral Source</Label>
                                    <Input
                                        id="referralSource"
                                        value={formData.referralSource || ''}
                                        onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.pilotAgreementSigned || false}
                                        onChange={(e) => setFormData({ ...formData, pilotAgreementSigned: e.target.checked })}
                                        disabled={!canEdit}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">Pilot Agreement Signed</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.caseStudyApproval || false}
                                        onChange={(e) => setFormData({ ...formData, caseStudyApproval: e.target.checked })}
                                        disabled={!canEdit}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">Case Study Approval</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {canEdit && (
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormData(organization)}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}

                    {!canEdit && (
                        <div className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-md">
                            You need Admin permissions to edit organization settings.
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    );
}
