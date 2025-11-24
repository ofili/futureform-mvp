'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface HubSpotSyncStats {
    totalLeads: number;
    syncedLeads: number;
    failedLeads: number;
    pendingLeads: number;
    lastSyncedAt?: string;
}

interface FailedLead {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    hubspotSyncError: string;
    createdAt: string;
}

export function HubSpotSyncStatus() {
    const [stats, setStats] = useState<HubSpotSyncStats | null>(null);
    const [failedLeads, setFailedLeads] = useState<FailedLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [retrying, setRetrying] = useState<string | null>(null);

    const fetchSyncStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/hubspot/sync-status');
            const data = await response.json();
            setStats(data.stats);
            setFailedLeads(data.failedLeads || []);
        } catch (error) {
            console.error('Error fetching HubSpot sync status:', error);
        } finally {
            setLoading(false);
        }
    };

    const retrySync = async (leadId: string) => {
        try {
            setRetrying(leadId);
            const response = await fetch('/api/admin/hubspot/retry-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId }),
            });

            if (response.ok) {
                // Refresh the status after retry
                await fetchSyncStatus();
            }
        } catch (error) {
            console.error('Error retrying sync:', error);
        } finally {
            setRetrying(null);
        }
    };

    const bulkRetryFailed = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/hubspot/bulk-retry', {
                method: 'POST',
            });

            if (response.ok) {
                await fetchSyncStatus();
            }
        } catch (error) {
            console.error('Error bulk retrying syncs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSyncStatus();
    }, []);

    if (loading && !stats) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-600">Loading HubSpot sync status...</span>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">HubSpot Integration Status</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSyncStatus}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Leads</p>
                                <p className="text-2xl font-bold">{stats?.totalLeads || 0}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Synced</p>
                                <p className="text-2xl font-bold text-green-700">{stats?.syncedLeads || 0}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-red-600">Failed</p>
                                <p className="text-2xl font-bold text-red-700">{stats?.failedLeads || 0}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats?.pendingLeads || 0}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {stats?.lastSyncedAt && (
                    <p className="text-sm text-gray-600 mt-4">
                        Last synced: {new Date(stats.lastSyncedAt).toLocaleString()}
                    </p>
                )}
            </Card>

            {/* Failed Syncs */}
            {failedLeads.length > 0 && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-red-700">Failed Syncs</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={bulkRetryFailed}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Retry All Failed
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {failedLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                                        <Badge variant="destructive" className="text-xs">Failed</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{lead.email}</p>
                                    <p className="text-sm text-gray-600">{lead.organization}</p>
                                    <p className="text-xs text-red-600 mt-2">
                                        Error: {lead.hubspotSyncError}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Created: {new Date(lead.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => retrySync(lead.id)}
                                    disabled={retrying === lead.id}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${retrying === lead.id ? 'animate-spin' : ''}`} />
                                    Retry
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Configuration Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-2">HubSpot Configuration</h4>
                        <p className="text-sm text-blue-800 mb-2">
                            Leads are automatically synced to HubSpot when they download the framework.
                            If a sync fails, the lead is still saved in the database and can be retried manually.
                        </p>
                        <a
                            href="https://app.hubspot.com/contacts"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            View contacts in HubSpot
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </Card>
        </div>
    );
}
