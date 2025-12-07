import { FileCheck, Activity, Target } from 'lucide-react';

export function DifferentiationSection() {
    const features = [
        {
            icon: FileCheck,
            title: "Evidence, not opinion.",
            description: "We don't want \"expert takes.\" We want logs, verified transactions, and signed governance docs."
        },
        {
            icon: Activity,
            title: "Continuous, not static.",
            description: "Due diligence PDFs rot. Trust signals should be live streams, monitoring partner health in real time."
        },
        {
            icon: Target,
            title: "Context-aware, not generic.",
            description: "Silicon Valley metrics don't work in Frontier Markets. Our benchmarks are local, specific, and battle-tested."
        }
    ];

    return (
        <section className="py-24 bg-midnight border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Why Gitance?
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Built different, for markets that are different.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-cyan-500/30 transition-all duration-300 group">
                                <div className="w-14 h-14 mx-auto mb-6 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                    <Icon size={24} className="text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
