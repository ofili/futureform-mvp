export function ProblemSection() {
    const problems = [
        {
            title: "Fragmented Data",
            description: "Trust signals exist, but they're scattered and unstructured.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
                </svg>
            )
        },
        {
            title: "Backward-Looking Reports",
            description: "Static PDFs that are outdated before deployment.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Binary Judgments",
            description: "\"Approved\" or \"Rejected\" with no nuance or monitoring.",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Due diligence isn't built for frontier markets
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Traditional assessment tools fail where you need them most.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {problems.map((problem, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    {problem.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{problem.title}</h3>
                                <p className="text-gray-600">{problem.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                        The result? Avoidable failures, capital loss, and missed opportunities.
                    </p>
                </div>
            </div>
        </section>
    );
}
