'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingTier {
    id: string;
    name: string;
    displayName: string;
    priceUSD: number | null;
    pricePeriod: string | null;
    creditsIncluded: number;
    bestFor: string | null;
    description: string | null;
    isActive: boolean;
    displayOrder: number;
    features: { id: string; feature: string; displayOrder: number }[];
    cta: string;
    ctaVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    ctaClass?: string;
    popular?: boolean;
    href?: string;
}

export function Pricing() {
    const [tiers, setTiers] = useState<PricingTier[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const response = await fetch('/api/v1/admin/tiers');
                if (response.ok) {
                    const data = await response.json();
                    // Filter active tiers and sort by display order
                    const activeTiers = data
                        .filter((t: PricingTier) => t.isActive)
                        .sort((a: PricingTier, b: PricingTier) => a.displayOrder - b.displayOrder);

                    // Enhance with UI specific properties if needed (though API should provide most)
                    const enhancedTiers = activeTiers.map((tier: PricingTier) => {
                        // Default styling logic based on tier name/type if not fully specified
                        let ctaVariant = tier.ctaVariant || 'outline';
                        let ctaClass = '';
                        let popular = false;
                        let href = '/auth/register'; // Default register link
                        let ctaText = 'Get Started';

                        if (tier.name === 'Framework Access') {
                            ctaVariant = 'secondary';
                            ctaClass = 'bg-gray-600 hover:bg-gray-700 text-white';
                            ctaText = 'Download Framework';
                        } else if (tier.name === 'Guided Assessment') {
                            ctaVariant = 'default';
                            ctaClass = 'bg-blue-600 hover:bg-blue-700';
                            popular = true;
                            ctaText = 'Start Assessment';
                        } else if (tier.name === 'Enterprise Program') {
                            ctaVariant = 'outline';
                            ctaClass = 'text-blue-600 border-blue-600 hover:bg-blue-50';
                            href = '/contact'; // Enterprise usually goes to contact
                            ctaText = 'Book Consultation';
                        }

                        return {
                            ...tier,
                            cta: ctaText,
                            ctaVariant,
                            ctaClass,
                            popular,
                            href
                        };
                    });

                    setTiers(enhancedTiers);
                }
            } catch (error) {
                console.error('Failed to fetch pricing tiers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTiers();
    }, []);

    if (isLoading) {
        return (
            <section id="pricing" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>Loading pricing...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600">
                        Pay per assessment. No subscriptions. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`bg-white rounded-lg p-8 shadow-sm flex flex-col h-full ${tier.popular ? 'border-2 border-blue-600 relative' : ''
                                }`}
                        >
                            <div className="flex-grow">
                                {tier.popular && (
                                    <div className="text-center mb-4 absolute -top-4 left-0 right-0">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tier.displayName}</h3>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {tier.priceUSD ? `$${tier.priceUSD.toLocaleString()}` : 'Free'}
                                    {tier.priceUSD === null && tier.pricePeriod === 'Custom' && 'Custom'}
                                </div>
                                {tier.pricePeriod && (
                                    <p className="text-sm text-gray-500 mb-4">{tier.pricePeriod}</p>
                                )}
                                <p className="text-gray-600 mb-6">{tier.description}</p>
                                <ul className="space-y-3 text-gray-600">
                                    {tier.features.map((f) => (
                                        <li key={f.id} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                                            <span>{f.feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Link href={tier.href || '/auth/register'}>
                                    <Button
                                        variant={tier.ctaVariant}
                                        className={`w-full ${tier.ctaClass}`}
                                    >
                                        {tier.cta}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="bg-gray-50 rounded-lg p-6 max-w-3xl mx-auto">
                        <p className="text-gray-700 mb-4">
                            <strong>Special pricing available for:</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <p>• Development finance institutions</p>
                            <p>• Impact funds and ESG investors</p>
                            <p>• National innovation programs</p>
                            <p>• Academic and research partnerships</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            <strong>Volume discounts:</strong> Contact us for multi-assessment packages starting at 5+ diagnostics.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
