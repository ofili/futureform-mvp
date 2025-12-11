'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Building2,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    Globe,
    MapPin,
    Shield,
    Loader2,
    FileText,
    Users,
    Mail,
    Phone,
    Calendar,
    Star,
    ArrowLeft,
    Edit,
    Plus,
    Search,
    ExternalLink,
    ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

interface PartnerDetail {
    id: string;
    displayName: string;
    relationshipStatus?: string;
    internalNotes?: string;
    cachedSector?: string;
    cachedCountry?: string;
    cachedWebsite?: string;
    createdAt: string;
    // Organization specific contact
    adminName?: string;
    adminEmail?: string;
    adminPhone?: string;
    partner: {
        id: string;
        legalName: string;
        website?: string;
        sector?: string;
        country?: string;
        verification: string;
        rcNumber?: string;
        cacNumber?: string;
        cacVerifiedName?: string;
        cacVerifiedAt?: string;
        cacVerificationData?: any;
        registeredAddress?: string;
        incorporationDate?: string;
        companyType?: string;
        directors?: any[];
        aggregateScore?: number;
    };
    contacts: Array<{
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
    }>;
    assessments: Array<{
        id: string;
        projectName: string;
        projectId: string;
        status: string;
        invitationStatus: string;
        createdAt: string;
        completedAt?: string;
        score?: number;
    }>;
    stats: {
        totalAssessments: number;
        completedAssessments: number;
        averageScore?: number;
        mostRecentScore?: number;
    };
}

export default function PartnerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const partnerId = params.id as string;
    const queryClient = useQueryClient();

    const [cacSectionOpen, setCacSectionOpen] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [editData, setEditData] = useState({
        displayName: '',
        internalNotes: '',
    });
    const [newContact, setNewContact] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
    });

    const { data: partner, isLoading, error } = useQuery<PartnerDetail>({
        queryKey: ['partner', partnerId],
        queryFn: async () => {
            const res = await fetch(`/api/v1/partners/${partnerId}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch partner');
            return res.json();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: typeof editData) => {
            const res = await fetch(`/api/v1/partners/${partnerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update partner');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partner', partnerId] });
            setIsEditDialogOpen(false);
            toast.success('Partner updated');
        },
    });

    const statusMutation = useMutation({
        mutationFn: async (status: string) => {
            const res = await fetch(`/api/v1/partners/${partnerId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ relationshipStatus: status }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partner', partnerId] });
            toast.success('Status updated');
        },
    });

    const addContactMutation = useMutation({
        mutationFn: async (data: typeof newContact) => {
            const res = await fetch(`/api/v1/partners/${partnerId}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to add contact');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partner', partnerId] });
            setIsAddContactOpen(false);
            setNewContact({ name: '', email: '', phone: '', role: '' });
            toast.success('Contact added successfully');
        },
        onError: (error) => {
            toast.error('Failed to add contact');
        }
    });

    const handleVerifyCAC = async () => {
        if (!partner?.partner.rcNumber) {
            toast.error('No RC Number to verify');
            return;
        }
        setIsVerifying(true);
        try {
            const res = await fetch(`/api/v1/partners/${partnerId}/cac-verify`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('CAC verification failed');
            queryClient.invalidateQueries({ queryKey: ['partner', partnerId] });
            toast.success('CAC verification complete');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-100 text-green-700">Active</Badge>;
            case 'Blocked':
                return <Badge variant="destructive">Blocked</Badge>;
            case 'Past':
                return <Badge variant="secondary">Past</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
        }
    };

    const getScoreColor = (score?: number) => {
        if (!score) return 'text-gray-400';
        if (score >= 4) return 'text-green-600';
        if (score >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !partner) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="text-center py-12 text-red-500">
                        Partner not found or access denied
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="p-6 space-y-6">
                    <PageHeader
                        title={partner.displayName}
                        description={partner.partner.legalName !== partner.displayName ? partner.partner.legalName : undefined}
                        breadcrumbs={[
                            { label: 'Partners', href: '/dashboard/partners' },
                            { label: partner.displayName || 'Partner' },
                        ]}
                        actions={
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditData({
                                            displayName: partner.displayName,
                                            internalNotes: partner.internalNotes || '',
                                        });
                                        setIsEditDialogOpen(true);
                                    }}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                {partner.relationshipStatus !== 'Active' && (
                                    <Button
                                        variant="outline"
                                        className="text-green-600 border-green-600"
                                        onClick={() => statusMutation.mutate('Active')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                )}
                                {partner.relationshipStatus !== 'Blocked' && (
                                    <Button
                                        variant="outline"
                                        className="text-red-600 border-red-600"
                                        onClick={() => statusMutation.mutate('Blocked')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Block
                                    </Button>
                                )}
                            </div>
                        }
                    />

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ClipboardList className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{partner.stats.totalAssessments}</p>
                                        <p className="text-xs text-muted-foreground">Total Assessments</p>
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
                                        <p className="text-xl font-bold">{partner.stats.completedAssessments}</p>
                                        <p className="text-xs text-muted-foreground">Completed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className={`text-xl font-bold ${getScoreColor(partner.stats.averageScore)}`}>
                                            {partner.stats.averageScore?.toFixed(1) || '-'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Average Score</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        {partner.partner.verification === 'CAC_VERIFIED' ? (
                                            <Shield className="w-4 h-4 text-purple-600" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-purple-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{partner.partner.verification}</p>
                                        <p className="text-xs text-muted-foreground">Verification</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* CAC Details Section */}
                            <Collapsible open={cacSectionOpen} onOpenChange={setCacSectionOpen}>
                                <Card>
                                    <CardHeader className="cursor-pointer" onClick={() => setCacSectionOpen(!cacSectionOpen)}>
                                        <CollapsibleTrigger asChild>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Shield className="w-5 h-5" />
                                                        CAC Registration Details
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Corporate Affairs Commission registration information
                                                    </CardDescription>
                                                </div>
                                                {cacSectionOpen ? (
                                                    <ChevronUp className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5" />
                                                )}
                                            </div>
                                        </CollapsibleTrigger>
                                    </CardHeader>
                                    <CollapsibleContent>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">RC Number</p>
                                                    <p className="font-medium">{partner.partner.rcNumber || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Company Type</p>
                                                    <p className="font-medium">{partner.partner.companyType || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Incorporation Date</p>
                                                    <p className="font-medium">
                                                        {partner.partner.incorporationDate
                                                            ? format(new Date(partner.partner.incorporationDate), 'MMM dd, yyyy')
                                                            : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Verified At</p>
                                                    <p className="font-medium">
                                                        {partner.partner.cacVerifiedAt
                                                            ? format(new Date(partner.partner.cacVerifiedAt), 'MMM dd, yyyy')
                                                            : 'Not verified'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Registered Address</p>
                                                <p className="font-medium">{partner.partner.registeredAddress || '-'}</p>
                                            </div>
                                            {partner.partner.directors && partner.partner.directors.length > 0 && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Directors</p>
                                                    <div className="space-y-2">
                                                        {partner.partner.directors.map((d: any, i: number) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                                <span>{d.name}</span>
                                                                {d.position && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {d.position}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {partner.partner.rcNumber && !partner.partner.cacVerifiedAt && (
                                                <Button
                                                    variant="outline"
                                                    onClick={handleVerifyCAC}
                                                    disabled={isVerifying}
                                                >
                                                    {isVerifying ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Search className="w-4 h-4 mr-2" />
                                                    )}
                                                    Verify with CAC
                                                </Button>
                                            )}
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>

                            {/* Assessments */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        Assessments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {partner.assessments.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">
                                            No assessments yet
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {partner.assessments.map((assessment) => (
                                                <Link
                                                    key={assessment.id}
                                                    href={`/assessments/${assessment.id}`}
                                                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{assessment.projectName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {format(new Date(assessment.createdAt), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {assessment.score && (
                                                                <Badge className={`${getScoreColor(assessment.score)} bg-gray-100`}>
                                                                    <Star className="w-3 h-3 mr-1" />
                                                                    {assessment.score.toFixed(1)}
                                                                </Badge>
                                                            )}
                                                            <Badge variant="outline">{assessment.status}</Badge>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Partner Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Partner Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(partner.relationshipStatus)}
                                    </div>
                                    <div className="space-y-3">
                                        {(partner.cachedSector || partner.partner.sector) && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span>{partner.cachedSector || partner.partner.sector}</span>
                                            </div>
                                        )}
                                        {(partner.cachedCountry || partner.partner.country) && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span>{partner.cachedCountry || partner.partner.country}</span>
                                            </div>
                                        )}
                                        {(partner.cachedWebsite || partner.partner.website) && (
                                            <a
                                                href={
                                                    (partner.cachedWebsite || partner.partner.website)?.startsWith('http')
                                                        ? partner.cachedWebsite || partner.partner.website
                                                        : `https://${partner.cachedWebsite || partner.partner.website}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Website
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span>Added {format(new Date(partner.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    {partner.internalNotes && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-muted-foreground mb-1">Internal Notes</p>
                                            <p className="text-sm">{partner.internalNotes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contacts */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Contacts</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => setIsAddContactOpen(true)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Primary/Admin Contact from PartnerAlias */}
                                        {(partner.adminName || partner.adminEmail) && (
                                            <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="secondary" className="bg-blue-200 text-blue-800 text-xs">
                                                        Primary Contact
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-gray-900">{partner.adminName || 'No Name'}</p>
                                                <div className="mt-2 space-y-1">
                                                    {partner.adminEmail && (
                                                        <a
                                                            href={`mailto:${partner.adminEmail}`}
                                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                                                        >
                                                            <Mail className="w-3 h-3" />
                                                            {partner.adminEmail}
                                                        </a>
                                                    )}
                                                    {partner.adminPhone && (
                                                        <a
                                                            href={`tel:${partner.adminPhone}`}
                                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                            {partner.adminPhone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {partner.contacts.length === 0 && !partner.adminName ? (
                                            <p className="text-sm text-muted-foreground">No contacts added</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {partner.contacts.map((contact) => (
                                                    <div key={contact.id} className="p-3 border rounded-lg">
                                                        <p className="font-medium">{contact.name || 'Unnamed Contact'}</p>
                                                        {contact.role && (
                                                            <Badge variant="outline" className="mt-1 text-xs">
                                                                {contact.role}
                                                            </Badge>
                                                        )}
                                                        <div className="mt-2 space-y-1">
                                                            {contact.email && (
                                                                <a
                                                                    href={`mailto:${contact.email}`}
                                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600"
                                                                >
                                                                    <Mail className="w-3 h-3" />
                                                                    {contact.email}
                                                                </a>
                                                            )}
                                                            {contact.phone && (
                                                                <a
                                                                    href={`tel:${contact.phone}`}
                                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600"
                                                                >
                                                                    <Phone className="w-3 h-3" />
                                                                    {contact.phone}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Partner</DialogTitle>
                        <DialogDescription>Update partner display name and notes</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                value={editData.displayName}
                                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="internalNotes">Internal Notes</Label>
                            <Textarea
                                id="internalNotes"
                                value={editData.internalNotes}
                                onChange={(e) => setEditData({ ...editData, internalNotes: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => updateMutation.mutate(editData)}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Contact Dialog */}
            <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Contact</DialogTitle>
                        <DialogDescription>Add a new contact person for this partner</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactName">Name</Label>
                            <Input
                                id="contactName"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Phone</Label>
                            <Input
                                id="contactPhone"
                                type="tel"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                placeholder="+234..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactRole">Role</Label>
                            <Input
                                id="contactRole"
                                value={newContact.role}
                                onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                                placeholder="e.g. Compliance Officer"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => addContactMutation.mutate(newContact)}
                            disabled={addContactMutation.isPending || !newContact.name}
                        >
                            {addContactMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Add Contact
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
