import React, { useState } from 'react';
import { TrustLayerWithSubDimensions } from '@/types/trust';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Layers, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TrustLayerCardProps {
    layer: TrustLayerWithSubDimensions;
}

export function TrustLayerCard({ layer }: TrustLayerCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="w-full mb-4 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary">
                            {layer.layerId}
                        </Badge>
                        <CardTitle className="text-xl">{layer.name}</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
                <CardDescription>{layer.description || 'No description available'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Baseline Weight</span>
                        <span className="font-medium">{(layer.baselineWeight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Total Questions</span>
                        <span className="font-medium">{layer.totalQuestions}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Sub-Dimensions</span>
                        <span className="font-medium">{layer.subDimensions.length}</span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Layers className="h-4 w-4" /> Sub-Dimensions
                        </h4>
                        <div className="grid gap-3">
                            {layer.subDimensions.map((sub) => (
                                <div key={sub.id} className="bg-muted/30 p-3 rounded-md border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-sm">{sub.dimensionId}: {sub.name}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            Weight: {(sub.weight * 100).toFixed(0)}%
                                        </Badge>
                                    </div>
                                    <Progress value={sub.weight * 100} className="h-1.5" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
