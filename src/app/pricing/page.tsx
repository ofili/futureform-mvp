'use client';

import React, { useState } from 'react';
import { Check, HelpCircle, Info, Download, ChevronDown, ChevronUp, Zap, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { ECPricingTable } from '@/components/credits/ec-pricing-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function CollapsibleFeatures({ features }: { features: string[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-8">
            <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-0 hover:bg-transparent hover:text-blue-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-sm">
                    {isOpen ? 'Hide features' : 'See features'}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </Button>

            {isOpen && (
                <ul className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start">
                            <div className="flex-shrink-0">
                                <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="ml-3 text-sm text-gray-700">{feature}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Simple, credible pricing for trust intelligence
                    </h1>
                    <p className="mt-5 text-xl text-gray-500">
                        Pay for what matters: <strong>Respondents</strong> (RC) and <strong>Evidence</strong> (EC).
                        <br />
                        No hidden fees. No mystery credits.
                    </p>
                </div>

                <Tabs defaultValue="rc" className="max-w-7xl mx-auto mb-16">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="rc">Respondent Packs (RC)</TabsTrigger>
                            <TabsTrigger value="ec">Evidence Packs (EC)</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="rc">
                        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
                            {/* Small Project */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Small Project</h3>
                                    <p className="mt-4 text-gray-500 text-sm">Perfect for pilots and small team assessments.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$3,500</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-blue-600 font-medium">10 Respondents ($350/each)</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '10 Respondent Credits (RC)',
                                            'Basic Assessment Templates',
                                            'Standard Support',
                                            'PDF Reports'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/auth/register?plan=small">
                                        <Button className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-600" size="lg">
                                            Buy Pack
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Standard Project */}
                            <div className="flex flex-col rounded-2xl shadow-xl bg-white overflow-hidden border-2 border-blue-600 relative transform scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Standard Project</h3>
                                    <p className="mt-4 text-gray-500 text-sm">The standard for departmental or unit assessments.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$6,250</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-blue-600 font-medium">25 Respondents ($250/each)</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '25 Respondent Credits (RC)',
                                            'Advanced Assessment Templates',
                                            'Priority Email Support',
                                            'Interactive Dashboards',
                                            '1 Analyst Review Session'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/auth/register?plan=standard">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                                            Buy Pack
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Organizational */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Organizational</h3>
                                    <p className="mt-4 text-gray-500 text-sm">For comprehensive organizational diagnostics.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$11,250</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-blue-600 font-medium">50 Respondents ($225/each)</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '50 Respondent Credits (RC)',
                                            'Custom Question Sets',
                                            'Dedicated Success Manager',
                                            'API Access',
                                            '3 Analyst Review Sessions'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/auth/register?plan=org">
                                        <Button className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-600" size="lg">
                                            Buy Pack
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ec">
                        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
                            {/* Starter Monitoring */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-200">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Starter Monitoring</h3>
                                    <p className="mt-4 text-gray-500 text-sm">Essential evidence collection and basic verification.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$500</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-purple-600 font-medium">500 Evidence Credits (EC)</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '500 EC included',
                                            'Access to AE & VE layers',
                                            'Basic Document Verification',
                                            'Email Support'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/auth/register?plan=ec-starter">
                                        <Button className="w-full bg-white hover:bg-gray-50 text-purple-600 border border-purple-600" size="lg">
                                            Buy Pack
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Pro Verification */}
                            <div className="flex flex-col rounded-2xl shadow-xl bg-white overflow-hidden border-2 border-purple-600 relative transform scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                                    Recommended
                                </div>
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Pro Verification</h3>
                                    <p className="mt-4 text-gray-500 text-sm">Deep verification and continuous monitoring.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$2,500</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-purple-600 font-medium">3,000 Evidence Credits (EC)</p>
                                    <p className="text-xs text-green-600 font-medium">Save $500 vs Starter</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '3,000 EC included',
                                            'Access to all layers (AE, VE, DSE)',
                                            'Analyst Reviews included',
                                            'API Access',
                                            'Auto-reload capable'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/auth/register?plan=ec-pro">
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                                            Buy Pack
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Enterprise Intelligence */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-200">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Enterprise Intelligence</h3>
                                    <p className="mt-4 text-gray-500 text-sm">High-volume signal processing and custom integrations.</p>
                                    <div className="mt-8 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">$10k</span>
                                        <span className="ml-1 text-xl font-semibold text-gray-500">/pack</span>
                                    </div>
                                    <p className="mt-1 text-sm text-purple-600 font-medium">15,000 Evidence Credits (EC)</p>
                                    <p className="text-xs text-green-600 font-medium">Save $5,000 vs Starter</p>

                                    <ul className="mt-8 space-y-4">
                                        {[
                                            '15,000 EC included',
                                            'Custom DSE Integrations',
                                            'Dedicated Analyst Team',
                                            'SLA Guarantees',
                                            'Volume Discounts'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-200">
                                    <Link href="/contact">
                                        <Button className="w-full bg-white hover:bg-gray-50 text-purple-600 border border-purple-600" size="lg">
                                            Contact Sales
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Evidence Pricing Table */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Transparent Evidence Pricing</h2>
                    <ECPricingTable />
                </div>

                {/* Enterprise & Gov Sections */}
                <div className="max-w-7xl mx-auto mt-20 grid gap-8 lg:grid-cols-2">
                    {/* Enterprise Program */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200">
                        <div className="p-8 flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">Enterprise Trust Program</h3>
                            <p className="mt-4 text-gray-600">
                                Organization-wide trust governance, benchmarking, and dedicated support.
                            </p>
                            <div className="mt-6 flex items-baseline text-gray-900">
                                <span className="text-3xl font-bold tracking-tight">$40k</span>
                                <span className="ml-1 text-lg text-gray-500">/year</span>
                            </div>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">Includes 100 RC + 5,000 EC</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">SSO & White-labeling</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">Priority Support & SLA</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-200">
                            <Link href="/contact">
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Government Program */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-indigo-200">
                        <div className="p-8 flex-1">
                            <h3 className="text-2xl font-bold text-indigo-900">Government & Multilateral</h3>
                            <p className="mt-4 text-gray-600">
                                National or multi-agency trust intelligence programs for high-stake deployments.
                            </p>
                            <div className="mt-6 flex items-baseline text-gray-900">
                                <span className="text-3xl font-bold tracking-tight">$150k+</span>
                                <span className="ml-1 text-lg text-gray-500">/year</span>
                            </div>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">Unlimited Respondents</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">National Trust Dashboards</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-700">Dedicated Analyst Team (2 FTE)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-200">
                            <Link href="/contact">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Speak to Government Team</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
