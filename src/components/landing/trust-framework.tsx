import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function TrustFramework() {
    const capabilities = [
        {
            title: "Partner Intelligence",
            subtitle: "Evaluate reliability before you commit.",
            description: "We map payment history, delivery performance, compliance records, and reputation signals into a single trust profile.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Project Assessment",
            subtitle: "Assess viability before capital moves.",
            description: "We analyze execution capacity, stakeholder alignment, regulatory risk, and deployment readiness.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: "Deployment Monitoring",
            subtitle: "Track risk in real time.",
            description: "Our platform surfaces warning signals, tracks milestones, and flags deviations before they become crises.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    ];

    return (
        <section id="solution" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Structured intelligence. Continuous visibility. Smarter decisions.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {capabilities.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm font-semibold text-blue-600 mb-4">{item.subtitle}</p>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/framework">
                        <Button variant="outline" className="h-12 px-8">
                            Learn About Our Technology
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
