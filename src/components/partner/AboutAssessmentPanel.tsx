'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function AboutAssessmentPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card>
            <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>About This Assessment</span>
                    {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                </CardTitle>
            </CardHeader>

            {isOpen && (
                <CardContent className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">What This Diagnostic Measures</h4>
                        <p>
                            The FutureForm Trust Diagnostic™ evaluates technology deployment readiness across six critical domains:
                            System Reliability, Operational Transparency, Governance & Accountability, Organizational Competence,
                            Vendor Integrity, and Stakeholder Alignment.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">How Your Data Is Used</h4>
                        <p>
                            Your responses are aggregated with other stakeholder inputs to generate a comprehensive Trust Profile™.
                            Individual responses are kept confidential and only shared with authorized project administrators.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Privacy & Confidentiality</h4>
                        <p>
                            All data is encrypted in transit and at rest. Your responses are protected by enterprise-grade security
                            and are never shared with third parties without explicit consent.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Why Only Some Questions Appear</h4>
                        <p>
                            Questions are role-mapped based on your expertise and organizational position. You only see questions
                            relevant to your domain knowledge, ensuring efficient assessment completion and high-quality responses.
                        </p>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
