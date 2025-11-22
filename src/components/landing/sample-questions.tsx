'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SampleQuestions() {
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const questions = [
        {
            category: 'RELIABILITY',
            question: 'Provide uptime logs for comparable deployments over the last 12 months.',
            evidenceRequired: 'Raw monitoring export (CSV/JSON), SLA documentation',
            validationMethod: 'Automated parser computes uptime percentage, compares to SLA; cross-checks with two client references',
            redFlag: 'Uptime <95% or refusal to provide logs → Conditional/NO-GO',
            whyMatters: 'Uptime claims are easy to make, impossible to fake. Historical logs reveal actual reliability patterns under real-world stress — not controlled lab conditions.'
        },
        {
            category: 'GOVERNANCE',
            question: 'Provide RACI matrix and board resolution assigning accountability for this partnership.',
            evidenceRequired: 'RACI document, signed board resolution with date, organizational chart',
            validationMethod: 'Verify signatures and timestamps; confirm accountability through stakeholder interviews',
            redFlag: 'No designated accountable owner → NO-GO',
            whyMatters: 'When things break (and they will), someone must have both authority and accountability to fix them. Organizational chart ambiguity kills partnerships.'
        },
        {
            category: 'INTEGRITY',
            question: 'Submit conflict-of-interest declarations and procurement decision logs.',
            evidenceRequired: 'COI declarations from key personnel, procurement records showing decision rationale',
            validationMethod: 'Cross-reference declared relationships against actual procurement decisions; verify with reference clients',
            redFlag: 'Undeclared conflicts of interest → NO-GO',
            whyMatters: 'Integrity risks hide in undisclosed relationships. This question surfaces hidden conflicts before they explode into governance crises.'
        }
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What the Assessment Actually Measures
                    </h2>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <button
                                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-grow">
                                    <div className="text-blue-600 font-semibold text-sm mb-2">EXAMPLE {index + 1}: {q.category}</div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        "{q.question}"
                                    </h3>
                                </div>
                                <svg
                                    className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ml-4 ${openQuestion === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openQuestion === index && (
                                <div className="px-8 pb-6 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
                                    <p><strong className="text-gray-900">Evidence Required:</strong> {q.evidenceRequired}</p>
                                    <p><strong className="text-gray-900">Validation Method:</strong> {q.validationMethod}</p>
                                    <p><strong className="text-red-600">Red Flag:</strong> {q.redFlag}</p>
                                    <p><strong className="text-gray-900">Why This Matters:</strong> {q.whyMatters}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/framework">
                        <Button variant="outline" size="lg">
                            View All 30 Questions in Framework Overview →
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
