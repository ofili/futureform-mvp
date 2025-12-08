'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Shield, Activity, Zap, Building, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button className="w-full flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
                <span className="font-medium text-gray-900">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            {isOpen && <p className="mt-3 text-gray-600 text-sm">{answer}</p>}
        </div>
    );
}

export default function PricingPage() {
    const faqs = [
        { question: "How do Respondent Credits (RC) work?", answer: "1 RC = 1 person can complete a trust assessment questionnaire. This could be the vendor you're assessing, their team members, references or stakeholders, or your internal team members providing input. Example: Assessing 1 vendor with 5 team members + 4 references = 10 RC." },
        { question: "How do Evidence Credits (EC) work?", answer: "EC are consumed when processing evidence beyond basic questionnaire responses: Document uploads (1 EC per file), Identity verification (5 EC per person), Company background check (10 EC per entity), Analyst investigation (50 EC per hour), API monitoring (10 EC per asset per month)." },
        { question: "What if I run out of Evidence Credits?", answer: "You can purchase additional EC packs anytime: 100 EC: $500, 500 EC: $2,000, 1,000 EC: $3,500. Or upgrade to a higher tier that includes more EC." },
        { question: "Do unused credits expire?", answer: "Respondent Credits are valid for 12 months from purchase. Evidence Credits are valid for 12 months from purchase. Enterprise subscriptions reset annually." },
        { question: "Can I mix and match workflows?", answer: "Yes! Common combinations: ASSESS → then add MONITOR for ongoing oversight. ASSESS → upgrade to VERIFY if red flags detected. VERIFY → includes baseline ASSESS automatically." },
        { question: "What's included in Expert Services that isn't in self-service?", answer: "Self-service (ASSESS) gives you AI-powered scoring across Layers 1-6, questionnaire-based evidence, and automated red flag detection. Expert services (VERIFY) adds Layer 7: Strategic Intent forensics, independent reference verification, forensic document analysis, behavioral pattern investigation, and human judgment on conflicting signals." },
        { question: "How do I choose between tiers?", answer: "Use ASSESS (Self-Service) if deployment value <$10M, standard vendor vetting, fast decision needed (days), or portfolio baseline assessment. Use VERIFY (Expert Service) if deployment value >$10M, previous vendor failures, critical infrastructure, self-service flags high risk, or institutional capital deployment." },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="py-20 px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="mt-5 text-xl text-gray-500">
                        Pay for what matters: <strong>Respondents</strong> (RC) and <strong>Evidence</strong> (EC).
                        <br />
                        Choose your workflow, then scale based on volume.
                    </p>
                </div>

                {/* Workflow Tabs */}
                <Tabs defaultValue="assess" className="max-w-7xl mx-auto mb-20">
                    <div className="flex justify-center mb-10">
                        <TabsList className="grid w-full max-w-2xl grid-cols-3">
                            <TabsTrigger value="assess" className="flex items-center gap-2"><Shield size={16} /> ASSESS</TabsTrigger>
                            <TabsTrigger value="monitor" className="flex items-center gap-2"><Activity size={16} /> MONITOR</TabsTrigger>
                            <TabsTrigger value="verify" className="flex items-center gap-2"><Zap size={16} /> VERIFY</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ASSESS Tab */}
                    <TabsContent value="assess">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900">Workflow 1: ASSESS Partners</h2>
                            <p className="text-gray-500 mt-2">AI-powered trust diagnostics in 48 hours</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                            {/* Starter */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-cyan-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Starter Assessment</h3>
                                    <p className="mt-2 text-gray-500 text-sm">Perfect for pilots and quick vendor checks.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$3,500</span>
                                        <span className="ml-1 text-gray-500">/assessment</span>
                                    </div>
                                    <p className="text-sm text-cyan-600 font-medium mt-1">10 RC + 50 EC included</p>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Basic assessment templates</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Standard email support</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> PDF reports</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/auth/register?plan=starter"><Button variant="outline" className="w-full">Buy Pack</Button></Link></div>
                            </div>
                            {/* Professional - HIGHLIGHTED */}
                            <div className="flex flex-col rounded-2xl shadow-2xl bg-white border-2 border-black relative lg:-mt-4 lg:-mb-4">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Most Popular</div>
                                <div className="p-8 flex-1 pt-10">
                                    <h3 className="text-xl font-semibold text-gray-900">Professional Assessment</h3>
                                    <p className="mt-2 text-gray-500 text-sm">The standard for procurement and M&A due diligence.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$6,250</span>
                                        <span className="ml-1 text-gray-500">/assessment</span>
                                    </div>
                                    <p className="text-sm text-cyan-600 font-medium mt-1">25 RC + 250 EC included</p>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Advanced templates</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Priority support</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Interactive dashboards</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 1 analyst review session</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-cyan-50 border-t border-cyan-100"><Link href="/auth/register?plan=professional"><Button className="w-full bg-black hover:bg-cyan-700 text-white">Buy Pack</Button></Link></div>
                            </div>
                            {/* Enterprise */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-cyan-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Enterprise Assessment</h3>
                                    <p className="mt-2 text-gray-500 text-sm">For complex organizational diagnostics.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$11,250</span>
                                        <span className="ml-1 text-gray-500">/assessment</span>
                                    </div>
                                    <p className="text-sm text-cyan-600 font-medium mt-1">50 RC + 500 EC included</p>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Custom question sets</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Dedicated success manager</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> API access</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 3 analyst review sessions</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/auth/register?plan=enterprise"><Button variant="outline" className="w-full">Buy Pack</Button></Link></div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* MONITOR Tab */}
                    <TabsContent value="monitor">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900">Workflow 2: MONITOR Deployments</h2>
                            <p className="text-gray-500 mt-2">Continuous trust signal tracking and performance monitoring</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                            {/* Monitoring Starter */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-blue-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Monitoring Starter</h3>
                                    <p className="mt-2 text-gray-500 text-sm">For single-deployment oversight.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$8,000</span>
                                        <span className="ml-1 text-gray-500">/month</span>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 1-5 active deployments</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Real-time trust score updates</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 100 EC/month included</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Email + Slack alerts</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button variant="outline" className="w-full">Start Monitoring</Button></Link></div>
                            </div>
                            {/* Monitoring Professional - HIGHLIGHTED */}
                            <div className="flex flex-col rounded-2xl shadow-2xl bg-white border-2 border-blue-500 relative lg:-mt-4 lg:-mb-4">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Popular</div>
                                <div className="p-8 flex-1 pt-10">
                                    <h3 className="text-xl font-semibold text-gray-900">Monitoring Professional</h3>
                                    <p className="mt-2 text-gray-500 text-sm">For portfolio-level oversight.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$15,000</span>
                                        <span className="ml-1 text-gray-500">/month</span>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 6-20 active deployments</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 500 EC/month included</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Priority alert routing</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> API access</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Quarterly analyst review (2h)</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-blue-50 border-t border-blue-100"><Link href="/contact"><Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Monitoring</Button></Link></div>
                            </div>
                            {/* Monitoring Enterprise */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-blue-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Monitoring Enterprise</h3>
                                    <p className="mt-2 text-gray-500 text-sm">For institutional portfolio management.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$25,000</span>
                                        <span className="ml-1 text-gray-500">/month</span>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 20+ active deployments</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 1,000 EC/month included</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Full API access</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Dedicated success manager</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Monthly analyst review (4h)</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button variant="outline" className="w-full">Contact Sales</Button></Link></div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* VERIFY Tab */}
                    <TabsContent value="verify">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900">Workflow 3: VERIFY Intent</h2>
                            <p className="text-gray-500 mt-2">Expert forensic investigation for high-stakes deployments</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                            {/* Intent Deep-Dive */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-purple-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Intent Deep-Dive</h3>
                                    <p className="mt-2 text-gray-500 text-sm">Layer 7 Strategic Intent forensic analysis.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$50,000</span>
                                        <span className="ml-1 text-gray-500">/investigation</span>
                                    </div>
                                    <p className="text-sm text-purple-600 font-medium mt-1">3-4 week timeline</p>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Full Layer 7 Intent assessment</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Commitment signal forensics</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 10-15 hours analyst investigation</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Proceed/conditional/veto recommendation</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button variant="outline" className="w-full">Request Quote</Button></Link></div>
                            </div>
                            {/* Full Diagnostic - HIGHLIGHTED */}
                            <div className="flex flex-col rounded-2xl shadow-2xl bg-white border-2 border-purple-500 relative lg:-mt-4 lg:-mb-4">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Recommended</div>
                                <div className="p-8 flex-1 pt-10">
                                    <h3 className="text-xl font-semibold text-gray-900">Full Deployment Diagnostic</h3>
                                    <p className="mt-2 text-gray-500 text-sm">Complete 7-layer assessment (Layers 1-7).</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$75,000</span>
                                        <span className="ml-1 text-gray-500">/investigation</span>
                                    </div>
                                    <p className="text-sm text-purple-600 font-medium mt-1">4-6 week timeline</p>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Full 6-layer baseline + Layer 7</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 20-25 hours analyst investigation</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 10-15 reference calls</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Comprehensive risk report (40-60 pages)</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-purple-50 border-t border-purple-100"><Link href="/contact"><Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Request Quote</Button></Link></div>
                            </div>
                            {/* Institutional Program */}
                            <div className="flex flex-col rounded-2xl shadow-lg bg-white border border-gray-200 hover:border-purple-300 transition-all">
                                <div className="p-8 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">Institutional Program</h3>
                                    <p className="mt-2 text-gray-500 text-sm">Multi-deployment forensic analysis with dedicated team.</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">$150k+</span>
                                        <span className="ml-1 text-gray-500">/year</span>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Unlimited ASSESS + MONITOR access</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 2 Full Diagnostics per year</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> Dedicated analyst team (2 FTE)</li>
                                        <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> National/regional dashboards</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button variant="outline" className="w-full">Contact Sales</Button></Link></div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Enterprise & Gov Sections */}
                <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2 mt-10">
                    {/* Enterprise Program */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-200">
                        <div className="p-8 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Building className="h-8 w-8 text-cyan-600" />
                                <h3 className="text-2xl font-bold text-gray-900">Enterprise Trust Program</h3>
                            </div>
                            <p className="text-gray-600">Organization-wide trust governance and supplier management.</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">$40,000</span>
                                <span className="ml-1 text-gray-500">/year</span>
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> 100 RC + 5,000 EC</li>
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> SSO & White-labeling</li>
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> Priority Support & SLA</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button variant="outline" className="w-full">Contact Sales</Button></Link></div>
                    </div>
                    {/* Government Program */}
                    <div className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-indigo-200">
                        <div className="p-8 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Landmark className="h-8 w-8 text-indigo-600" />
                                <h3 className="text-2xl font-bold text-indigo-900">Government & Multilateral</h3>
                            </div>
                            <p className="text-gray-600">National-level trust intelligence infrastructure.</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">$150,000+</span>
                                <span className="ml-1 text-gray-500">/year</span>
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> Unlimited Respondent Credits</li>
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> National Trust Dashboards</li>
                                <li className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-2" /> Dedicated Analyst Team (2 FTE)</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-gray-50 border-t"><Link href="/contact"><Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">Speak to Government Team</Button></Link></div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>

                {/* Decision Guide */}
                <div className="max-w-4xl mx-auto mt-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Which Service Do You Need?</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-cyan-700 mb-4">Use Self-Service AI Assessment When:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ Deployment value &lt;$10M</li>
                                <li>✓ Fast decision timeline (days)</li>
                                <li>✓ Standard vendor vetting</li>
                                <li>✓ Portfolio baseline assessment</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-purple-700 mb-4">Request Expert Intent Analysis When:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ Deployment value &gt;$10M</li>
                                <li>✓ Critical infrastructure or strategic importance</li>
                                <li>✓ Previous vendor failures</li>
                                <li>✓ AI assessment flags high risk</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-8 text-gray-500">Not sure? <Link href="/contact" className="text-cyan-600 underline">Schedule 15-min consultation</Link></p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
