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
        <section className="bg-gray-50 py-12 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">40+</div>
                        <div className="text-sm font-semibold text-gray-900">Organizations Trusted</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
                        <div className="text-sm font-semibold text-gray-900">Frontier Markets Covered</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">$2B+</div>
                        <div className="text-sm font-semibold text-gray-900">Capital Protected</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
