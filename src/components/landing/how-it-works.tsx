export function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: 'Connect',
            description: 'Integrate your data sources, upload partner lists, or start with our proprietary intelligence layer.',
        },
        {
            number: 2,
            title: 'Analyze',
            description: 'Our platform structures trust signals, assigns risk scores, and generates deployment-ready assessments.',
        },
        {
            number: 3,
            title: 'Deploy with Confidence',
            description: 'Make go/no-go decisions backed by evidence. Monitor continuously. Adjust in real time.',
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        From signals to decisions in three steps
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-blue-100 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="text-center relative">
                            <div className="w-24 h-24 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-blue-600">{step.number}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
