'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PricingTier {
    id: string;
    name: string;
    displayName: string;
    priceUSD: number | null;
    baseFeeUSD: number | null;
    type: string;
    description?: string | null;
    bands: CreditBand[];
}

interface CreditBand {
    minCount: number;
    maxCount: number | null;
    pricePerUnit: number;
}

interface PricingCalculatorProps {
    tiers: PricingTier[];
    currentTierName?: string;
    onSelectTier?: (tier: PricingTier, respondentCount: number, estimatedCost: number) => void;
}

export function PricingCalculator({ tiers, currentTierName, onSelectTier }: PricingCalculatorProps) {
    const [respondentCount, setRespondentCount] = useState<number>(50);
    const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

    // Filter out free tiers for the calculator usually, or keep them for comparison
    const paidTiers = tiers.filter(t => t.type !== 'FREE');

    useEffect(() => {
        if (!selectedTierId && paidTiers.length > 0) {
            // Default to the first paid tier or the current tier if it's paid
            const current = paidTiers.find(t => t.name === currentTierName);
            setSelectedTierId(current ? current.id : paidTiers[0].id);
        }
    }, [tiers, currentTierName, paidTiers, selectedTierId]);

    const calculateCost = (tier: PricingTier, count: number) => {
        if (!tier.baseFeeUSD && tier.bands.length === 0) return 0;

        let cost = Number(tier.baseFeeUSD) || 0;
        let remainingCount = count;

        // Sort bands by minCount
        const sortedBands = [...tier.bands].sort((a, b) => a.minCount - b.minCount);

        for (const band of sortedBands) {
            if (remainingCount <= 0) break;

            const bandCapacity = band.maxCount ? band.maxCount - band.minCount + 1 : Infinity;
            const countInBand = Math.min(remainingCount, bandCapacity); // This logic assumes bands are cumulative ranges, e.g. 1-100, 101-500. 
            // Wait, usually banded pricing is either "all units at the falling band price" or "progressive".
            // Let's assume progressive for now as it's more common in SaaS, OR check if bands are defined as "1-100", "101-500".
            // If the schema has minCount and maxCount, it supports progressive.
            // Actually, let's simplify: If I have 150 respondents.
            // Band 1: 1-100 @ $1. Band 2: 101-500 @ $0.8.
            // Cost = 100 * $1 + 50 * $0.8.

            // However, the logic above `Math.min(remainingCount, bandCapacity)` is slightly wrong if we don't track "filled" bands.
            // Correct logic for progressive:
            // We need to see how many respondents fall into this band.
            // But `remainingCount` approach is tricky if we don't know where we started.

            // Let's restart calculation logic:
            // We iterate through bands. For each band, we calculate how many of the TOTAL `count` fall within [minCount, maxCount].

            const start = band.minCount;
            const end = band.maxCount ?? Infinity;

            // Intersection of [1, count] and [start, end]
            // The number of units in this band is max(0, min(count, end) - start + 1)
            // Wait, if minCount is 1-based.
            // Example: Count 150. Band 1: 1-100. Band 2: 101-500.
            // Band 1 overlap: min(150, 100) - 1 + 1 = 100.
            // Band 2 overlap: min(150, 500) - 101 + 1 = 50.

            const overlap = Math.max(0, Math.min(count, end) - start + 1);
            cost += overlap * Number(band.pricePerUnit);
        }

        return cost;
    };

    const selectedTier = tiers.find(t => t.id === selectedTierId);
    const estimatedCost = selectedTier ? calculateCost(selectedTier, respondentCount) : 0;

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Number of Respondents</Label>
                    <span className="text-2xl font-bold text-primary">{respondentCount}</span>
                </div>
                <Slider
                    value={[respondentCount]}
                    onValueChange={(val: number[]) => setRespondentCount(val[0])}
                    min={1}
                    max={1000}
                    step={1}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>250</span>
                    <span>500</span>
                    <span>750</span>
                    <span>1000+</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paidTiers.map((tier) => {
                    const cost = calculateCost(tier, respondentCount);
                    const isSelected = selectedTierId === tier.id;

                    return (
                        <Card
                            key={tier.id}
                            className={`cursor-pointer transition-all ${isSelected ? 'border-primary shadow-md ring-1 ring-primary' : 'hover:border-primary/50'}`}
                            onClick={() => setSelectedTierId(tier.id)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{tier.displayName}</CardTitle>
                                        <CardDescription>{tier.description}</CardDescription>
                                    </div>
                                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold">
                                        ${cost.toFixed(2)}
                                        <span className="text-sm font-normal text-muted-foreground"> / project</span>
                                    </div>
                                    {tier.baseFeeUSD && Number(tier.baseFeeUSD) > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            Includes ${Number(tier.baseFeeUSD)} base fee
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isSelected ? "default" : "outline"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTierId(tier.id);
                                        if (onSelectTier) onSelectTier(tier, respondentCount, cost);
                                    }}
                                >
                                    {isSelected ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground flex gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                    Pricing is calculated based on the number of respondents you invite.
                    Volume discounts are automatically applied as you add more respondents.
                </p>
            </div>
        </div>
    );
}
