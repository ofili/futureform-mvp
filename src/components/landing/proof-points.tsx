export function ProofPoints() {
    const outcomes = [
        { value: '$127M', label: 'Failed Partnerships Avoided', sublabel: 'Organizations using our framework in 2024' },
        { value: '83%', label: 'Correlation', sublabel: 'Between low trust scores and partnership failure within 24 months' },
        { value: '6mo → 3wk', label: 'Time Reduction', sublabel: 'Reduce due diligence time while improving predictive accuracy' },
        { value: '15', label: 'Governance Gaps', sublabel: 'Average red flags caught before deployment in Joint Assessments' }
    ];

    const methodology = [
        'Exact evidence required (documents, logs, references)',
        'Validation protocol (how we verify authenticity)',
        'Red flag logic (conditions that trigger NO-GO/Conditional status)',
        'Scoring weight (derived from outcome correlation analysis)'
    ];

    const research = [
        { value: '200+', label: 'Deployments Analyzed', sublabel: 'Across 35 emerging markets (2015-2024)' },
        { value: 'R²=0.76', label: 'Correlation', sublabel: 'Trust dimension scores vs. adoption outcomes (p < 0.001)' },
        { value: '82%', label: 'Predictive Accuracy', sublabel: 'Correct classification of eventual success vs. failure' }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Evidence-Based. Battle-Tested. Results-Driven.
                    </h2>
                </div>

                {/* Outcomes */}
                <div className="mb-16">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Outcomes</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        {outcomes.map((outcome, index) => (
                            <div key={index} className="bg-blue-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{outcome.value}</div>
                                <div className="text-sm font-semibold text-gray-900 mb-2">{outcome.label}</div>
                                <div className="text-xs text-gray-600">{outcome.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Methodology */}
                <div className="mb-16">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Methodology</h3>
                    <div className="bg-white rounded-lg p-8 shadow-sm max-w-4xl mx-auto">
                        <p className="text-gray-700 mb-6">
                            <strong>30 evidence-based questions</strong> across 5 interdependent trust layers
                        </p>
                        <div className="space-y-3 text-gray-600">
                            {methodology.map((item, index) => (
                                <p key={index}>→ {item}</p>
                            ))}
                        </div>
                        <p className="text-gray-700 font-medium mt-6">
                            Not consultant opinions. Not AI black boxes. Systematic, replicable, defensible methodology.
                        </p>
                    </div>
                </div>

                {/* Research Validation */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Research Validation</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {research.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{item.value}</div>
                                <div className="text-sm font-semibold text-gray-900 mb-2">{item.label}</div>
                                <div className="text-xs text-gray-600">{item.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
