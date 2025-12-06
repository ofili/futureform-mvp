
export function DifferentiationSection() {
    const features = [
        {
            title: "Evidence, not opinion.",
            description: "We don't want \"expert takes.\" We want logs, verified transactions, and signed governance docs."
        },
        {
            title: "Continuous, not static.",
            description: "Due diligence PDFs rot. Trust signals should be live streams, monitoring partner health in real time."
        },
        {
            title: "Context-aware, not generic.",
            description: "Silicon Valley metrics don't work in Frontier Markets. Our benchmarks are local, specific, and battle-tested."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Gitance?
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
