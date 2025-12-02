import React, { useEffect } from 'react';
import { useTrustOntology } from '@/hooks/use-trust-ontology';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info } from 'lucide-react';
import { TrustPartnerTypeWithRoles } from '@/types/trust';

interface TrustPartnerTypeSelectorProps {
    value?: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export function TrustPartnerTypeSelector({ value, onChange, required }: TrustPartnerTypeSelectorProps) {
    const { partnerTypes, isLoading, fetchPartnerTypes } = useTrustOntology();

    useEffect(() => {
        if (partnerTypes.length === 0) {
            fetchPartnerTypes();
        }
    }, [fetchPartnerTypes, partnerTypes.length]);

    const selectedPartnerType = partnerTypes.find(pt => pt.id === value) as TrustPartnerTypeWithRoles | undefined;

    if (isLoading && partnerTypes.length === 0) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading partner types...
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Select value={value} onValueChange={onChange} required={required}>
                <SelectTrigger>
                    <SelectValue placeholder="Select partner type" />
                </SelectTrigger>
                <SelectContent>
                    {partnerTypes.map((pt) => (
                        <SelectItem key={pt.id} value={pt.id}>
                            {pt.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedPartnerType && (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-primary mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">{selectedPartnerType.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedPartnerType.description}</p>
                            </div>
                        </div>

                        {selectedPartnerType.requiredRoles && selectedPartnerType.requiredRoles.length > 0 && (
                            <div className="pt-2 border-t border-dashed">
                                <p className="text-xs font-semibold mb-2">Key Roles:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedPartnerType.requiredRoles.slice(0, 5).map((role) => (
                                        <Badge key={role.id} variant="secondary" className="text-[10px]">
                                            {role.name}
                                        </Badge>
                                    ))}
                                    {selectedPartnerType.requiredRoles.length > 5 && (
                                        <Badge variant="outline" className="text-[10px]">
                                            +{selectedPartnerType.requiredRoles.length - 5} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
