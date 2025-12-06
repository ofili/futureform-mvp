export function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: 'Choose Your Assessment Mode',
            modes: [
                {
                    name: 'A Priori Assessment',
                    description: 'Evaluate a potential partner before commitment. Perfect for due diligence, vendor selection, or pre-investment assessment.'
                },
                {
                    name: 'Post Hoc Monitoring',
                    description: 'Monitor an existing partner&apos;s trust health during delivery.Track whether trust is strengthening or degrading over time.'
                },
                {
                    name: 'Joint Assessment',
                    description: 'Both parties complete the diagnostic together — building shared understanding and identifying gaps proactively.'
                }
            ]
        },
        {
            number: 2,
            title: 'Submit Evidence (Not Promises)',
            description: 'Our framework contains 30 evidence-based questions (6 per trust layer) — each requiring specific, verifiable documentation.',
            example: {
                wrong: '"Do you have incident response procedures?" ✓',
                right: '"Submit your escalation SOP, incident log template, and a resolved incident from the last 6 months."'
            },
            requirements: [
                'Performance logs and monitoring data (not claims)',
                'Governance documents with signatures and dates',
                'Reference checks with unreferenced clients (weighted 1.5×)',
                'Financial records and runway calculations (not projections)',
                'Training effectiveness metrics (competency tests, not attendance)'
            ],
            timeInvestment: '60-90 minutes'
        },
        {
            number: 3,
            title: 'Get Your Trust Profile™',
            description: 'Our validation system analyzes your evidence and generates a comprehensive intelligence report:',
            outputs: [
                {
                    icon: '✓',
                    color: 'green',
                    title: 'Domain Scores (0-100)',
                    description: 'Quantitative performance across all five trust layers with confidence intervals'
                },
                {
                    icon: '⚠',
                    color: 'red',
                    title: 'Red Flag Alerts',
                    description: 'Automated detection of NO-GO conditions (governance gaps, delivery risks)'
                },
                {
                    icon: '📊',
                    color: 'blue',
                    title: 'Comparative Benchmarks',
                    description: 'How does this profile compare to similar organizations in your sector?'
                },
                {
                    icon: '📋',
                    color: 'purple',
                    title: 'Evidence Quality Assessment',
                    description: 'Which claims are well-supported? Which need deeper investigation?'
                },
                {
                    icon: '🛠️',
                    color: 'orange',
                    title: 'Remediation Roadmap',
                    description: 'Prioritized recommendations with timeline and cost estimates'
                },
                {
                    icon: '📄',
                    color: 'gray',
                    title: 'Partner-Ready Report',
                    description: 'Professional documentation you can share with boards, investors, or oversight committees'
                }
            ]
        }
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        From Evidence to Intelligence in Three Steps
                    </h2>
                </div>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-blue-600">{step.number}</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>

                                    {step.modes && (
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {step.modes.map((mode, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded-lg p-6">
                                                    <h4 className="font-semibold text-gray-900 mb-2">{mode.name}</h4>
                                                    <p className="text-sm text-gray-600">{mode.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {step.description && (
                                        <>
                                            <p className="text-gray-600 mb-6">{step.description}</p>
                                            {step.example && (
                                                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                                    <p className="text-gray-700 mb-2">
                                                        <strong>Not this:</strong> {step.example.wrong}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>But this:</strong> {step.example.right}
                                                    </p>
                                                </div>
                                            )}
                                            {step.requirements && (
                                                <div className="space-y-2 text-gray-600">
                                                    {step.requirements.map((req, idx) => (
                                                        <p key={idx}>→ {req}</p>
                                                    ))}
                                                </div>
                                            )}
                                            {step.timeInvestment && (
                                                <p className="text-sm text-gray-500 mt-4">
                                                    <strong>Time investment:</strong> {step.timeInvestment}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {step.outputs && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {step.outputs.map((output, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <span className={`text-${output.color}-600 text-xl`}>{output.icon}</span>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{output.title}</h4>
                                                        <p className="text-sm text-gray-600">{output.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
