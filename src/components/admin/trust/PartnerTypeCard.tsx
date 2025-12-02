import React from 'react';
import { TrustPartnerTypeWithRoles } from '@/types/trust';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Shield, BarChart3 } from 'lucide-react';

interface PartnerTypeCardProps {
    partnerType: TrustPartnerTypeWithRoles;
}

export function PartnerTypeCard({ partnerType }: PartnerTypeCardProps) {
    // Parse layer weights if it's a string, otherwise use as is
    const layerWeights = typeof partnerType.layerWeights === 'string'
        ? JSON.parse(partnerType.layerWeights)
        : partnerType.layerWeights;

    return (
        <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{partnerType.name}</CardTitle>
                    <Badge variant="outline">{partnerType.requiredRoles.length} Roles</Badge>
                </div>
                <CardDescription>{partnerType.description || 'No description available'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Required Roles Section */}
                    <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                            <Users className="h-4 w-4" /> Required Roles
                        </h4>
                        <ScrollArea className="h-[150px] pr-4">
                            <div className="space-y-2">
                                {partnerType.requiredRoles.map((role) => (
                                    <div key={role.id} className="bg-muted/30 p-2 rounded border text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium">{role.name}</span>
                                            <Badge variant={role.criticality === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                                                {role.criticality}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Focus: {role.assessmentFocus}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Layer Weights Section */}
                    <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                            <BarChart3 className="h-4 w-4" /> Layer Emphasis
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(layerWeights).map(([layerId, weight]) => (
                                <div key={layerId} className="flex justify-between items-center text-sm bg-muted/20 p-2 rounded">
                                    <span className="font-mono text-xs">{layerId}</span>
                                    <span className="font-medium">{((weight as number) * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
