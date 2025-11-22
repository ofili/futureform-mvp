export function ProblemSection() {
    const problems = [
        {
            icon: (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            scenario: [
                'A regional DFI invests $80M in an infrastructure partner.',
                'Clean audits. Strong financials. Impressive credentials.',
                'Eighteen months later, the partner exits the market.',
                'Capital stranded.'
            ]
        },
        {
            icon: (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
            scenario: [
                'A government deploys a $50M digital identity system.',
                'Technology works perfectly in testing.',
                'In production, citizens refuse to enroll.',
                'Program suspended.'
            ]
        },
        {
            icon: (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            scenario: [
                'An impact fund backs a promising social enterprise.',
                'ESG scores are excellent. Leadership seems committed.',
                'Within two years, governance collapses under pressure.',
                '$15M write-off.'
            ]
        }
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Do Partnerships That Look Perfect on Paper Still Fail?
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {problems.map((problem, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                                    {problem.icon}
                                </div>
                                <div className="space-y-3">
                                    {problem.scenario.map((text, idx) => (
                                        <p
                                            key={idx}
                                            className={idx === problem.scenario.length - 1 ? "text-red-600 font-semibold" : "text-gray-600"}
                                        >
                                            {idx < problem.scenario.length - 1 && text.includes('$') ? (
                                                <>
                                                    {text.split('$')[0]}
                                                    <strong className="text-gray-900">${text.split('$')[1]}</strong>
                                                </>
                                            ) : (
                                                text
                                            )}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
