import { BarChart3, CheckCircle } from 'lucide-react';

export function FeatureTaxonomy() {
    const features = [
        {
            category: "Core Trust (AI Assessment)",
            items: [
                "System Reliability",
                "Operational Transparency",
                "Governance & Accountability",
                "Organizational Competence",
                "Vendor Integrity",
                "Ecosystem Trust"
            ],
            color: "text-white",
            borderColor: "border-cyan-500/50",
            checkColor: "text-cyan-400"
        },
        {
            category: "Strategic Intent (Expert)",
            items: [
                "Strategic Intent Analysis",
                "Commitment Signal Forensics",
                "Incentive Structure Analysis",
                "Historical Pattern Detection"
            ],
            color: "text-purple-400",
            borderColor: "border-purple-500/50",
            checkColor: "text-purple-400"
        }
    ];

    return (
        <section className="py-24 bg-gray-950 border-y border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <BarChart3 size={14} className="text-white" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">The Framework</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        The 7-Layer Trust Diagnostic
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We measure what matters. Layers 1-6 via AI in 48 hours. Layer 7 via expert forensics.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {features.map((section) => (
                        <div key={section.category} className={`bg-gray-900/50 rounded-xl p-8 border ${section.borderColor} relative overflow-hidden group hover:bg-gray-900 transition-colors`}>
                            <h3 className={`text-xl font-bold mb-6 ${section.color}`}>{section.category}</h3>
                            <ul className="space-y-4">
                                {section.items.map((item) => (
                                    <li key={item} className="flex items-center text-gray-300">
                                        <CheckCircle size={18} className={`${section.checkColor} mr-3 flex-shrink-0`} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
