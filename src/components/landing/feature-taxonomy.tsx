
export function FeatureTaxonomy() {
    const features = [
        {
            title: "Trust Score",
            subtitle: "The Unified Metric",
            description: "A single, comparable 0-100 rating aggregating 250+ signal nodes across governance, financial, and operational vectors.",
            stat: "0-100",
            statLabel: "Precision Scale"
        },
        {
            title: "Trust Graph",
            subtitle: "Relationship Mapping",
            description: "Visualize hidden connections between entities. Detect ultimate beneficial owners (UBOs) and political exposure paths.",
            stat: "340k+",
            statLabel: "Mapped Entities"
        },
        {
            title: "Risk Index",
            subtitle: "Market Benchmarking",
            description: "Contextualize partner performance against local market baselines. Know if a 'low' score is an outlier or the norm.",
            stat: "15",
            statLabel: "Markets Indexed"
        }
    ];

    return (
        <section className="py-24 bg-midnight text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        The Intelligence Layer
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We decompose trust into measurable, verifiable signal nodes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors duration-300 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6">
                                <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest">{feature.subtitle}</span>
                                <h3 className="text-2xl font-bold text-white mt-2">{feature.title}</h3>
                            </div>

                            <p className="text-gray-400 leading-relaxed mb-8 h-24">
                                {feature.description}
                            </p>

                            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-white">{feature.stat}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{feature.statLabel}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
