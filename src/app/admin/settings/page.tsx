'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, RefreshCw, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSpotSyncStatus } from "@/components/admin/hubspot-sync-status";

interface PlatformConfig {
    id: string;
    key: string;
    value: any;
    category: string;
    description: string | null;
    updatedAt: string;
}

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('general');

    const { data: groupedConfigs, isLoading } = useQuery<Record<string, PlatformConfig[]>>({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/settings');
            if (!response.ok) throw new Error('Failed to fetch settings');
            return response.json();
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: any }) => {
            const response = await fetch('/api/v1/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            if (!response.ok) throw new Error('Failed to update setting');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Setting updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        },
        onError: () => {
            toast.error('Failed to update setting');
        }
    });

    const seedMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/v1/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' }),
            });
            if (!response.ok) throw new Error('Failed to seed settings');
            return response.json();
        },
        onSuccess: (data) => {
            toast.success(`Settings initialized (${data.seeded} new)`);
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        },
        onError: () => {
            toast.error('Failed to seed settings');
        }
    });

    const handleSave = (key: string, value: any) => {
        updateMutation.mutate({ key, value });
    };

    const renderEditor = (config: PlatformConfig) => {
        const type = typeof config.value;

        if (type === 'boolean') {
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={config.value}
                        onCheckedChange={(checked) => handleSave(config.key, checked)}
                        disabled={updateMutation.isPending}
                    />
                    <Label>{config.value ? 'Enabled' : 'Disabled'}</Label>
                </div>
            );
        }

        if (type === 'string' || type === 'number') {
            return (
                <div className="flex gap-2">
                    <Input
                        defaultValue={config.value}
                        onBlur={(e) => {
                            const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
                            if (newValue !== config.value) {
                                handleSave(config.key, newValue);
                            }
                        }}
                        disabled={updateMutation.isPending}
                        className="max-w-md"
                    />
                </div>
            );
        }

        return (
            <div className="text-sm text-muted-foreground">
                Complex type editing not supported yet ({type})
            </div>
        );
    };

    const categories = groupedConfigs ? Object.keys(groupedConfigs) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage global platform configuration
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => seedMutation.mutate()}
                    disabled={seedMutation.isPending}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                    Initialize Defaults
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading settings...</div>
            ) : categories.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Settings className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg font-medium">No settings found</p>
                        <p className="text-muted-foreground">Click "Initialize Defaults" to create standard configuration values.</p>
                        <Button onClick={() => seedMutation.mutate()}>Initialize Defaults</Button>
                    </CardContent>
                </Card>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        {categories.map(category => (
                            <TabsTrigger key={category} value={category} className="capitalize">
                                {category}
                            </TabsTrigger>
                        ))}
                        <TabsTrigger value="hubspot">HubSpot Integration</TabsTrigger>
                    </TabsList>

                    {categories.map(category => (
                        <TabsContent key={category} value={category}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="capitalize">{category} Settings</CardTitle>
                                    <CardDescription>
                                        Manage configuration for {category} module
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {groupedConfigs?.[category]?.map(config => (
                                        <div key={config.key} className="flex flex-col space-y-2 p-4 border rounded-lg bg-card/50">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <Label className="text-base font-medium">
                                                        {config.key.split('.')[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {config.description || config.key}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                {renderEditor(config)}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}

                    <TabsContent value="hubspot">
                        <HubSpotSyncStatus />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
