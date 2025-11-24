import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function TrustFramework() {
    const trustLayers = [
        {
            name: 'System Reliability',
            subtitle: 'The Technical Bedrock',
            question: 'Will this system work consistently under MY operational conditions?',
            color: 'purple',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            name: 'Operational Transparency',
            subtitle: 'The Black Box Problem',
            question: 'Do I understand what this system does and how it uses my data?',
            color: 'yellow',
            icon: (
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )
        },
        {
            name: 'Governance & Accountability',
            subtitle: 'The Accountability Layer',
            question: "Who's responsible when things go wrong?",
            color: 'green',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: 'Organizational Competence',
            subtitle: 'The Human Factor',
            question: 'Can we operate, maintain, and optimize this system?',
            color: 'blue',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            name: 'Vendor Integrity',
            subtitle: 'The Long-Term Assurance',
            question: 'Will this partner be here long-term?',
            color: 'red',
            icon: (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'Ecosystem Trust',
            subtitle: 'The Interdependence Layer',
            question: 'Can we trust the broader ecosystem to support rather than undermine this deployment?',
            color: 'indigo',
            icon: (
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    return (
        <section id="framework" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trust Intelligence: What Due Diligence Misses
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        FutureForm is the trust intelligence company redefining how organizations assess partnership readiness in emerging markets.
                    </p>
                    <div className="max-w-4xl mx-auto space-y-4 text-gray-600">
                        <p>
                            We've spent 10 years analyzing why partnerships fail in complex environments — across 200+ technology deployments from Lagos to Nairobi to Kigali.
                        </p>
                        <p className="font-medium text-gray-900">
                            What we discovered: Trust failures follow patterns across six interdependent layers.
                        </p>
                        <p>
                            A deficit in one layer undermines everything above it. But any single layer alone isn't enough.
                        </p>
                    </div>
                </div>

                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
                        The Six-Layer Trust Framework™
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {trustLayers.map((layer, index) => (
                            <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${layer.color}-100 flex items-center justify-center`}>
                                    {layer.icon}
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{layer.name}</h4>
                                <p className="text-xs text-gray-500 mb-3 italic">{layer.subtitle}</p>
                                <p className="text-sm text-gray-600">{layer.question}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/framework">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Download Framework Guide
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-blue-50 rounded-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Insight:</h3>
                        <div className="space-y-4 text-gray-700">
                            <p>Trust failures compound.</p>
                            <p>
                                A technically reliable system (Layer 1) still fails if users don't understand it (Layer 2). Strong governance (Layer 3) breaks down if teams lack competence (Layer 4). Everything collapses if the partner exits the market (Layer 5). Even perfect execution fails without stakeholder alignment (Layer 6).
                            </p>
                            <div className="mt-6 pt-6 border-t border-blue-200">
                                <p className="text-gray-600">
                                    Traditional due diligence checks Layer 1 compliance.
                                </p>
                                <p className="font-semibold text-blue-600 mt-2">
                                    FutureForm measures all six layers — with evidence, not promises.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
