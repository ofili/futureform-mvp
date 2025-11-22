'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users, DollarSign } from 'lucide-react';

interface PricingTier {
    name: string;
    minRespondents: number;
    maxRespondents: number | null;
    pricePerRespondent: number;
}

const GUIDED_TIERS: PricingTier[] = [
    { name: '1-10 respondents', minRespondents: 1, maxRespondents: 10, pricePerRespondent: 400 },
    { name: '11-50 respondents', minRespondents: 11, maxRespondents: 50, pricePerRespondent: 250 },
    { name: '51-200 respondents', minRespondents: 51, maxRespondents: 200, pricePerRespondent: 150 },
];

const ENTERPRISE_BASE_FEE = 25000;
const ENTERPRISE_TIERS: PricingTier[] = [
    { name: '1-50 respondents', minRespondents: 1, maxRespondents: 50, pricePerRespondent: 150 },
    { name: '51-200 respondents', minRespondents: 51, maxRespondents: 200, pricePerRespondent: 75 },
    { name: '201+ respondents', minRespondents: 201, maxRespondents: null, pricePerRespondent: 50 },
];

export function RespondentPricingCalculator() {
    const [respondentCount, setRespondentCount] = useState<number>(10);
    const [isEnterprise, setIsEnterprise] = useState(false);

    const calculatePrice = (count: number, enterprise: boolean) => {
        if (count <= 0) return { total: 0, perRespondent: 0, tier: null, baseFee: 0 };

        const tiers = enterprise ? ENTERPRISE_TIERS : GUIDED_TIERS;
        let total = enterprise ? ENTERPRISE_BASE_FEE : 0;
        let remainingCount = count;
        let applicableTier: PricingTier | null = null;

        for (const tier of tiers) {
            if (remainingCount <= 0) break;

            const tierMax = tier.maxRespondents || Infinity;
            const tierMin = tier.minRespondents;

            if (count >= tierMin) {
                applicableTier = tier;
                const countInTier = Math.min(remainingCount, tierMax - tierMin + 1);
                total += countInTier * tier.pricePerRespondent;
                remainingCount -= countInTier;
            }
        }

        return {
            total,
            perRespondent: applicableTier?.pricePerRespondent || 0,
            tier: applicableTier,
            baseFee: enterprise ? ENTERPRISE_BASE_FEE : 0
        };
    };

    const pricing = calculatePrice(respondentCount, isEnterprise);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Pricing Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="respondents">Expected Number of Respondents</Label>
                        <div className="relative mt-2">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="respondents"
                                type="number"
                                min="1"
                                value={respondentCount}
                                onChange={(e) => setRespondentCount(parseInt(e.target.value) || 0)}
                                className="pl-10"
                                placeholder="Enter number of respondents"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="enterprise"
                            checked={isEnterprise}
                            onChange={(e) => setIsEnterprise(e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="enterprise" className="cursor-pointer">
                            Enterprise Plan (includes base fee of ${ENTERPRISE_BASE_FEE.toLocaleString()})
                        </Label>
                    </div>
                </div>

                {/* Results Section */}
                {respondentCount > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Price Per Respondent</div>
                                <div className="text-2xl font-bold text-blue-700">
                                    ${pricing.perRespondent}
                                </div>
                                {pricing.tier && (
                                    <Badge variant="outline" className="mt-2">
                                        {pricing.tier.name}
                                    </Badge>
                                )}
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
                                <div className="text-2xl font-bold text-green-700 flex items-center gap-1">
                                    <DollarSign className="h-5 w-5" />
                                    {pricing.total.toLocaleString()}
                                </div>
                                {isEnterprise && (
                                    <div className="text-xs text-muted-foreground mt-2">
                                        Includes ${ENTERPRISE_BASE_FEE.toLocaleString()} base fee
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div className="font-medium text-foreground mb-2">Cost Breakdown:</div>
                            {isEnterprise && (
                                <div className="flex justify-between">
                                    <span>Base Fee:</span>
                                    <span>${ENTERPRISE_BASE_FEE.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>{respondentCount} respondents × ${pricing.perRespondent}:</span>
                                <span>${(respondentCount * pricing.perRespondent).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-medium text-foreground pt-2 border-t">
                                <span>Total:</span>
                                <span>${pricing.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Recommendations */}
                        {!isEnterprise && respondentCount >= 50 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                                <strong>💡 Tip:</strong> For {respondentCount} respondents, consider our Enterprise plan for better rates and additional features like SSO, white-labeling, and priority support.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
