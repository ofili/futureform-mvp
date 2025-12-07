import { BarChart3, TrendingUp, Zap, Database } from 'lucide-react';

export function FeatureTaxonomy() {
    const features = [
        {
            title: "Trust Score",
            subtitle: "The Unified Metric",
            description: "A single, comparable 0-100 rating aggregating 250+ signal nodes across governance, financial, and operational vectors.",
            stat: "0-100",
            statLabel: "Precision Scale",
            icon: TrendingUp
        },
        {
            title: "Trust Graph",
            subtitle: "Relationship Mapping",
            description: "Visualize hidden connections between entities. Detect ultimate beneficial owners (UBOs) and political exposure paths.",
            stat: "340k+",
            statLabel: "Mapped Entities",
            icon: Database
        },
        {
            title: "Risk Index",
            subtitle: "Market Benchmarking",
            description: "Contextualize partner performance against local market baselines. Know if a 'low' score is an outlier or the norm.",
            stat: "35",
            statLabel: "Markets Indexed",
            icon: Zap
        }
    ];

    return (
        <section className="py-24 bg-midnight border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <BarChart3 size={14} className="text-cyan-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Intelligence Layer</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        The Intelligence Layer
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We decompose trust into measurable, verifiable signal nodes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="relative p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300 group">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon size={16} className="text-cyan-400" />
                                        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">{feature.subtitle}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                                </div>

                                <p className="text-gray-400 leading-relaxed mb-8">
                                    {feature.description}
                                </p>

                                <div className="border-t border-gray-800 pt-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-bold text-white">{feature.stat}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{feature.statLabel}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
