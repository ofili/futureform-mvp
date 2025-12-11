'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Building2,
    Plus,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Edit,
    Globe,
    MapPin,
    Shield,
    Loader2,
    FileText,
    Search,
    Star,
    ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
    id: string;
    displayName: string;
    relationshipStatus?: string;
    cachedSector?: string;
    cachedCountry?: string;
    cachedWebsite?: string;
    partner: {
        id: string;
        legalName: string;
        website?: string;
        sector?: string;
        country?: string;
        verification: string;
        rcNumber?: string;
        aggregateScore?: number;
    };
}

export default function PartnersPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [formData, setFormData] = useState({
        legalName: '',
        rcNumber: '',
        website: '',
        sector: '',
        country: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
    });

    const queryClient = useQueryClient();

    const { data: partners = [], isLoading } = useQuery<Partner[]>({
        queryKey: ['partners'],
        queryFn: async () => {
            const res = await fetch('/api/v1/partners', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch partners');
            const data = await res.json();
            return data.partners || [];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch('/api/v1/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create partner');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partners'] });
            setIsAddDialogOpen(false);
            setFormData({
                legalName: '',
                rcNumber: '',
                website: '',
                sector: '',
                country: '',
                adminName: '',
                adminEmail: '',
                adminPhone: '',
            });
            toast.success('Partner added successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ partnerId, status }: { partnerId: string; status: string }) => {
            const res = await fetch(`/api/v1/partners/${partnerId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ relationshipStatus: status }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update status');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partners'] });
            toast.success('Partner status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const handleVerifyCAC = async () => {
        if (!formData.rcNumber.trim()) {
            toast.error('Please enter an RC Number');
            return;
        }

        setIsVerifying(true);
        try {
            const res = await fetch('/api/v1/partners/cac-lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ rcNumber: formData.rcNumber }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'CAC lookup failed');
            }

            const data = await res.json();
            if (data.data) {
                setFormData({
                    ...formData,
                    legalName: data.data.companyName || formData.legalName,
                    sector: data.data.companyType || formData.sector,
                });
                toast.success('Company found in CAC registry');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to verify with CAC');
        } finally {
            setIsVerifying(false);
        }
    };

    const filteredPartners = partners.filter(
        (p) =>
            p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.partner.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.partner.rcNumber && p.partner.rcNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        total: partners.length,
        active: partners.filter((p) => p.relationshipStatus === 'Active').length,
        pending: partners.filter((p) => p.relationshipStatus === 'Pending' || !p.relationshipStatus).length,
        blocked: partners.filter((p) => p.relationshipStatus === 'Blocked').length,
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'Blocked':
                return <Badge variant="destructive">Blocked</Badge>;
            case 'Past':
                return <Badge variant="secondary">Past</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
        }
    };

    const getVerificationBadge = (verification: string) => {
        switch (verification) {
            case 'FUTUREFORM_VERIFIED':
            case 'CAC_VERIFIED':
                return (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Shield className="w-3 h-3 mr-1" />
                        CAC Verified
                    </Badge>
                );
            case 'SELF_VERIFIED':
                return <Badge variant="outline">Self-Verified</Badge>;
            default:
                return null;
        }
    };

    const getScoreBadge = (score?: number) => {
        if (!score) return null;
        const color = score >= 4 ? 'green' : score >= 3 ? 'yellow' : 'red';
        return (
            <Badge className={`bg-${color}-100 text-${color}-700 hover:bg-${color}-100`}>
                <Star className="w-3 h-3 mr-1" />
                {score.toFixed(1)}
            </Badge>
        );
    };

    const handleApprove = (partner: Partner) => {
        updateStatusMutation.mutate({ partnerId: partner.id, status: 'Active' });
    };

    const handleBlock = (partner: Partner) => {
        updateStatusMutation.mutate({ partnerId: partner.id, status: 'Blocked' });
    };

    const handleAddPartner = () => {
        if (!formData.legalName.trim()) {
            toast.error('Partner name is required');
            return;
        }
        createMutation.mutate(formData);
    };

    const handlePartnerClick = (partner: Partner) => {
        router.push(`/dashboard/partners/${partner.id}`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="p-6 space-y-6">
                    <PageHeader
                        title="Partners"
                        description="Manage your partner organizations"
                        breadcrumbs={[{ label: 'Partners' }]}
                        searchPlaceholder="Search partners, RC number..."
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        actions={
                            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Partner
                            </Button>
                        }
                    />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Building2 className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                                        <p className="text-xs text-gray-500">Total Partners</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stats.active}</p>
                                        <p className="text-xs text-gray-500">Active</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                                        <p className="text-xs text-gray-500">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stats.blocked}</p>
                                        <p className="text-xs text-gray-500">Blocked</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Partners List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Partners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                </div>
                            ) : filteredPartners.length === 0 ? (
                                <div className="text-center py-12">
                                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No partners yet</h3>
                                    <p className="text-gray-500 mb-4">Add your first partner to get started</p>
                                    <Button onClick={() => setIsAddDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Partner
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredPartners.map((partner) => (
                                        <div
                                            key={partner.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handlePartnerClick(partner)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-100 rounded-lg">
                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {partner.displayName}
                                                        </h4>
                                                        {getStatusBadge(partner.relationshipStatus)}
                                                        {getVerificationBadge(partner.partner.verification)}
                                                        {getScoreBadge(partner.partner.aggregateScore)}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                        {partner.partner.rcNumber && (
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="w-3 h-3" />
                                                                RC {partner.partner.rcNumber}
                                                            </span>
                                                        )}
                                                        {(partner.cachedSector || partner.partner.sector) && (
                                                            <span>{partner.cachedSector || partner.partner.sector}</span>
                                                        )}
                                                        {(partner.cachedCountry || partner.partner.country) && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {partner.cachedCountry || partner.partner.country}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                {partner.relationshipStatus !== 'Active' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                        onClick={() => handleApprove(partner)}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                )}
                                                {partner.relationshipStatus !== 'Blocked' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        onClick={() => handleBlock(partner)}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Block
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePartnerClick(partner)}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Partner Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Add New Partner</DialogTitle>
                        <DialogDescription>
                            Add a new partner organization. Enter the RC Number to auto-fill details from CAC.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* RC Number with Verify Button */}
                        <div className="space-y-2">
                            <Label htmlFor="rcNumber">RC Number (CAC Registration)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="rcNumber"
                                    placeholder="e.g., RC123456"
                                    value={formData.rcNumber}
                                    onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleVerifyCAC}
                                    disabled={isVerifying || !formData.rcNumber.trim()}
                                >
                                    {isVerifying ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4 mr-1" />
                                            Verify CAC
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Enter the company's CAC registration number to automatically fetch company details
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="legalName">Organization Name *</Label>
                            <Input
                                id="legalName"
                                placeholder="Partner Organization Ltd"
                                value={formData.legalName}
                                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                            />
                        </div>

                        {/* Admin Contact Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adminName">Contact Person Name</Label>
                                <Input
                                    id="adminName"
                                    placeholder="Jane Doe"
                                    value={formData.adminName}
                                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">Contact Email</Label>
                                <Input
                                    id="adminEmail"
                                    type="email"
                                    placeholder="jane@partner.com"
                                    value={formData.adminEmail}
                                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                placeholder="https://partner.com"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sector">Sector</Label>
                                <Input
                                    id="sector"
                                    placeholder="Technology"
                                    value={formData.sector}
                                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="Nigeria"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPartner} disabled={createMutation.isPending}>
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Partner
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
