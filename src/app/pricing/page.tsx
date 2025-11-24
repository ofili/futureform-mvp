'use client';

import React, { useState } from 'react';
import { Check, HelpCircle, Info, Download, ChevronDown, ChevronUp } from 'lucide-react';
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

// Note: Metadata export not supported in client components
// SEO handled by layout.tsx template

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
                        Clear packs and enterprise programs that align price with the people who make your deployment succeed.
                        Pay for respondents — not mystery credits.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-8">
                    {/* Free Tier */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200">
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                            <p className="mt-4 text-gray-500 text-sm">Explore the toolkit and run a small internal pilot.</p>
                            <div className="mt-8 flex items-baseline text-gray-900">
                                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Up to 30 questions (internal use)',
                                    'Single-user pilot',
                                    'Watermarked PDF export',
                                    'Starter scoring & templates'
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
                            <Link href="/auth/register">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                                    Get Started for Free
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Guided Tier */}
                    <div className="flex flex-col rounded-2xl shadow-xl bg-white overflow-hidden border-2 border-blue-600 relative transform scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                            Most Popular
                        </div>
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Guided</h3>
                            <p className="mt-4 text-gray-500 text-sm">Validated assessments with analyst review and practical remediation plans.</p>

                            <div className="mt-8">
                                <div className="flex items-baseline text-gray-900">
                                    <span className="text-3xl font-extrabold tracking-tight">Respondent packs — anchored & simple</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Choose a pack — predictable pricing and clear outcomes.</p>
                            </div>

                            <CollapsibleFeatures features={[
                                'Partner assessment portal',
                                'Role-mapped questions',
                                'Trust report and remediation plan',
                                'Automated evidence checks',
                                '1 analyst review per 20 respondents',
                                'Email support'
                            ]} />
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-3">
                            <div className="grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-1">
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm font-medium text-gray-700">Small Project Pack</div>
                                    <div className="mt-2 text-lg font-bold text-gray-900">$3,500</div>
                                    <div className="text-xs text-gray-500">10 respondents — $350 / each</div>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-sm font-medium text-blue-900">Standard Project Pack</div>
                                    <div className="mt-2 text-lg font-bold text-blue-900">$6,250</div>
                                    <div className="text-xs text-blue-700">25 respondents — $250 / each</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm font-medium text-gray-700">Organizational Pack</div>
                                    <div className="mt-2 text-lg font-bold text-gray-900">$11,250</div>
                                    <div className="text-xs text-gray-500">50 respondents — $225 / each</div>
                                </div>
                            </div>

                            <Link href="/auth/register?plan=guided" className="block mt-8">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                                    Start Guided Assessment
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200">
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Enterprise Trust Program</h3>
                            <p className="mt-4 text-gray-500 text-sm">Organization-wide trust governance, benchmarking, and dedicated support.</p>

                            <div className="mt-8">
                                <div className="flex items-baseline text-gray-900">
                                    <span className="text-4xl font-extrabold tracking-tight">$40k</span>
                                    <span className="ml-1 text-xl font-semibold text-gray-500">/year</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Includes 100 respondent credits — additional seats discounted.</p>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Unlimited projects & assessments',
                                    'SSO & White-labeling',
                                    'API access & custom integrations',
                                    'Priority support & SLA',
                                    'Dedicated success manager',
                                    'Custom question sets & weighting',
                                    'Comparative analytics & benchmarks (Enterprise-only)'
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
                                <Button className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-600" size="lg">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* TIER 4 — GOVERNMENT & MULTILATERAL PROGRAM */}
                <div className="max-w-7xl mx-auto mt-10">
                    <div className="flex flex-col rounded-2xl shadow-xl bg-white overflow-hidden border-2 border-indigo-600">
                        <div className="p-8 lg:p-12">
                            <h3 className="text-2xl font-bold text-gray-900">Government & Multilateral Program</h3>
                            <p className="mt-4 text-gray-600 text-sm">
                                A national or multi-agency trust intelligence program for high-stake public deployments,
                                complex ecosystems, and multi-stakeholder governance.
                            </p>

                            <div className="mt-8 flex items-baseline text-gray-900">
                                <span className="text-4xl font-extrabold tracking-tight">$150k+</span>
                                <span className="ml-2 text-xl font-semibold text-gray-500">/year</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Unlimited respondents across agencies & partner organizations',
                                    'National trust dashboards & policy intelligence',
                                    'PPP & ecosystem trust scoring',
                                    'Country-level benchmarking & trend analysis',
                                    'Dedicated analyst team (2 FTE)',
                                    'Custom domain models & regulatory alignment',
                                    'Advanced integrations & data governance support',
                                    'Quarterly executive briefings & program reviews'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Check className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10">
                                <Link href="/contact">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                                        Speak to Government Team
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Respondent Pricing Breakdown */}
                <div className="max-w-4xl mx-auto mt-20">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">How respondent pricing works</h3>
                                    <p className="text-gray-600 mb-6">
                                        We price on the number of respondents because people create the signal. Packs make budgeting predictable — anchor on the Standard Project Pack for most assessments.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Link href="/mnt/data/The Trust Diagnostic Toolkit™.pdf">
                                        <Button variant="ghost" className="flex items-center gap-2">
                                            <Download className="h-4 w-4" /> Download Toolkit
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                        Guided Packs (Recommended)
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="h-4 w-4 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Choose the pack that matches project complexity — most customers choose the Standard Project Pack.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <span className="font-medium text-blue-900">Small Project Pack — 10</span>
                                            <span className="font-bold text-blue-700">$3,500</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">Standard Project Pack — 25</span>
                                            <span className="font-bold text-gray-900">$6,250</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">Organizational Pack — 50</span>
                                            <span className="font-bold text-gray-900">$11,250</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">High-Volume Pack — 100</span>
                                            <span className="font-bold text-gray-900">$17,500</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                        Enterprise Bands
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="h-4 w-4 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Enterprise includes an initial block of respondent credits and deeper analytics tools.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <span className="font-medium text-indigo-900">Included credits</span>
                                            <span className="font-bold text-indigo-700">100</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">Additional — 1–100</span>
                                            <span className="font-bold text-gray-900">$100 / each</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">Additional — 101–500</span>
                                            <span className="font-bold text-gray-900">$75 / each</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">Additional — 500+</span>
                                            <span className="font-bold text-gray-900">$50 / each</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                                <p className="font-medium mb-1">Notes</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Standard Project Pack (25 respondents) is the most common purchase and serves as our anchor price.</li>
                                    <li>Enterprise includes 100 respondent credits on first-year commitment and scales with volume discounts.</li>
                                    <li>Unused respondent credits can be rolled over subject to terms; contact sales for custom SLAs and multi-year discounts.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
