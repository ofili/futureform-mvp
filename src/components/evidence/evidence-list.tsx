'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format } from 'date-fns';
import { EvidenceLayer, VerificationStatus } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

interface EvidenceListProps {
    organizationId: string;
}

interface EvidenceItem {
    id: string;
    layer: EvidenceLayer;
    type: string;
    category?: string;
    verificationStatus: VerificationStatus;
    ecCost?: number;
    createdAt: string;
    uploader: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
}

export function EvidenceList({ organizationId }: EvidenceListProps) {
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [layerFilter, setLayerFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { toast } = useToast();

    useEffect(() => {
        fetchEvidence();
    }, [organizationId, layerFilter, statusFilter]);

    const fetchEvidence = async () => {
        try {
            setLoading(true);
            let url = `/api/v1/evidence?organizationId=${organizationId}`;

            if (layerFilter !== 'ALL') {
                url += `&layer=${layerFilter}`;
            }
            if (statusFilter !== 'ALL') {
                url += `&status=${statusFilter}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch evidence');

            const data = await res.json();
            setEvidence(data);
        } catch (error) {
            console.error('Error fetching evidence:', error);
            toast({
                title: 'Error',
                description: 'Failed to load evidence. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: VerificationStatus) => {
        switch (status) {
            case VerificationStatus.VALIDATED:
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
            case VerificationStatus.REJECTED:
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            case VerificationStatus.PENDING:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getLayerBadge = (layer: EvidenceLayer) => {
        switch (layer) {
            case EvidenceLayer.AE:
                return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">AE</Badge>;
            case EvidenceLayer.VE:
                return <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">VE</Badge>;
            case EvidenceLayer.DSE:
                return <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">DSE</Badge>;
            default:
                return <Badge variant="outline">{layer}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={layerFilter} onValueChange={setLayerFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by Layer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Layers</SelectItem>
                            <SelectItem value="AE">Assessment (AE)</SelectItem>
                            <SelectItem value="VE">Verification (VE)</SelectItem>
                            <SelectItem value="DSE">Digital Signal (DSE)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="VERIFIED">Verified</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" onClick={fetchEvidence}>
                    Refresh List
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Layer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Cost (EC)</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                        Loading evidence...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : evidence.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No evidence found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            evidence.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{item.type}</span>
                                            {item.category && (
                                                <span className="text-xs text-muted-foreground">{item.category}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getLayerBadge(item.layer)}</TableCell>
                                    <TableCell>{getStatusBadge(item.verificationStatus)}</TableCell>
                                    <TableCell>{item.ecCost ? item.ecCost.toFixed(2) : '-'}</TableCell>
                                    <TableCell>
                                        {item.uploader.firstName} {item.uploader.lastName}
                                    </TableCell>
                                    <TableCell>{format(new Date(item.createdAt), 'MMM d, yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/dashboard/evidence/${item.id}`}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
