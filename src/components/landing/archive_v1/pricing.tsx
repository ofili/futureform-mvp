'use client';

import { useState } from 'react';
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
    features: { id: string; feature: string }[];
    cta: string;
    ctaVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    ctaClass?: string;
    popular?: boolean;
    href?: string;
    displayOrder?: number;
    isActive?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
    {
        id: 'free',
        name: 'Framework Access',
        displayName: 'Free',
        priceUSD: null, // Display as "Free"
        pricePeriod: 'Forever',
        creditsIncluded: 0,
        bestFor: 'Single-user internal use',
        description: 'Essential tools for internal assessment.',
        features: [
            { id: 'f1', feature: 'Up to 30 questions' },
            { id: 'f2', feature: 'Single-user access' },
            { id: 'f3', feature: 'Basic evidence uploads' },
            { id: 'f4', feature: 'No partner invites' },
        ],
        cta: 'Get Started',
        ctaVariant: 'outline',
        ctaClass: '',
        href: '/auth/register',
        displayOrder: 1,
        isActive: true,
    },
    {
        id: 'guided',
        name: 'Guided Assessment',
        displayName: 'Guided',
        priceUSD: 250,
        pricePeriod: 'per respondent',
        creditsIncluded: 0,
        bestFor: 'SMB / Mid-market',
        description: 'Comprehensive assessment with analyst support.',
        features: [
            { id: 'g1', feature: 'Full platform access' },
            { id: 'g2', feature: 'TeamTrust profile' },
            { id: 'g3', feature: 'Basic reporting' },
            { id: 'g4', feature: '1 analyst review per 10 respondents' },
            { id: 'g5', feature: 'Unlimited assessments' },
        ],
        cta: 'Start Assessment',
        ctaVariant: 'default',
        ctaClass: 'bg-blue-600 hover:bg-blue-700',
        popular: true,
        href: '/auth/register',
        displayOrder: 2,
        isActive: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise Program',
        displayName: 'Enterprise',
        priceUSD: 25000,
        pricePeriod: 'per year (base)',
        creditsIncluded: 50,
        bestFor: 'Large Organizations',
        description: 'Full-scale solution for complex needs.',
        features: [
            { id: 'e1', feature: 'SSO & White-labeling' },
            { id: 'e2', feature: 'API Access' },
            { id: 'e3', feature: 'Priority Support' },
            { id: 'e4', feature: 'Unlimited assessments' },
            { id: 'e5', feature: 'Dedicated Success Manager' },
        ],
        cta: 'Book Consultation',
        ctaVariant: 'outline',
        ctaClass: 'text-blue-600 border-blue-600 hover:bg-blue-50',
        href: '/contact',
        displayOrder: 3,
        isActive: true,
    },
];

export function Pricing() {
    const [tiers] = useState<PricingTier[]>(PRICING_TIERS);

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
