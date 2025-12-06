import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AudienceSection() {
    const audiences = [
        {
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
            color: 'blue',
            title: 'Development Finance Institutions',
            challenge: 'Six-month due diligence cycles still miss behavioral risks. Partners look perfect on paper, then collapse under operational pressure.',
            solution: 'Reduce assessment time from months to weeks while improving predictive accuracy. Monitor trust health across portfolios. Catch degradation before crisis.',
            result: '"A regional infrastructure fund used our framework to vet 12 potential partners across 4 countries — completed in 3 weeks with higher confidence than their traditional 6-month process. Two partners flagged for governance gaps; fund avoided $15M in write-offs."',
            cta: 'Run Portfolio Assessment →'
        },
        {
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'green',
            title: 'Impact Investors & ESG Funds',
            challenge: 'ESG frameworks measure inputs (policies exist), not outcomes (policies actually work). You need behavioral intelligence, not compliance checklists.',
            solution: 'Add trust scores to your investment thesis as predictive metrics. Monitor execution quality continuously, not just at entry. Integrate with existing ESG frameworks.',
            result: '"An impact fund facing portfolio crisis used our Post Hoc diagnostics to triage 20 partners — identifying which relationships could be salvaged vs. which needed immediate intervention. Trust scores correlated 0.82 with ultimate outcomes. Fund saved 40% of at-risk capital."',
            cta: 'Strengthen ESG Due Diligence →'
        },
        {
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: 'purple',
            title: 'Innovation & Transformation Programs',
            challenge: 'Multi-stakeholder programs fail before technology even launches. Trust gaps between government, private sector, and communities derail initiatives.',
            solution: 'Run Joint Assessments where all parties complete the diagnostic together — surfacing misalignments proactively before they become crises.',
            result: '"A national digital ID program used Joint Assessment to align 8 government agencies and 3 tech partners before launch — identifying 23 governance gaps and 15 competence mismatches. Program launched 4 months ahead of schedule with 73% fewer coordination issues."',
            cta: 'Assess Program Readiness →'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Built for Leaders Who Can't Afford to Guess
                    </h2>
                </div>

                <div className="space-y-8">
                    {audiences.map((audience, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-start gap-6">
                                <div className={`w-12 h-12 flex-shrink-0 bg-${audience.color}-100 rounded-lg flex items-center justify-center`}>
                                    {audience.icon}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{audience.title}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Your Challenge:</p>
                                            <p className="text-gray-600">{audience.challenge}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">How Gitance Helps:</p>
                                            <p className="text-gray-600">{audience.solution}</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-6">
                                            <p className="text-gray-700 italic mb-2">Real Result:</p>
                                            <p className="text-gray-600 text-sm">{audience.result}</p>
                                        </div>
                                        <div className="mt-4">
                                            <Link href="/auth/register">
                                                <Button>{audience.cta}</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
