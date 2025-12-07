import Link from 'next/link';
import { Shield, Activity, Zap, Cpu, ArrowRight } from 'lucide-react';

export function ProductSuite() {
    const products = [
        {
            id: "partner-intelligence",
            title: "Partner Intelligence",
            description: "Evaluate before you commit. The industry standard for pre-investment partner vetting.",
            features: ["Partner Trust Report", "Risk Score", "6 Trust Layers"],
            icon: Shield,
            color: 'amber',
            href: "/products/partner-intelligence"
        },
        {
            id: "deployment-insights",
            title: "Deployment Insights",
            description: "Track real-world performance. Monitoring that doesn't sleep when the contract is signed.",
            features: ["Deployment File", "Activity Graph", "Real-Time Alerts"],
            icon: Activity,
            color: 'blue',
            href: "/products/deployment-insights"
        },
        {
            id: "trust-signals",
            title: "Trust Signals",
            description: "Raw data, structured. Access the underlying indices and nodes powering our intelligence.",
            features: ["Market Index", "Raw Nodes", "Evidence Vault"],
            icon: Zap,
            color: 'green',
            href: "/products/trust-signals"
        },
        {
            id: "gitance-engine",
            title: "Gitance Engine",
            description: "The core processing power. Automated extraction, parsing, and scoring at scale.",
            features: ["Document Parser", "Signal Extractor", "API Access"],
            icon: Cpu,
            color: 'cyan',
            href: "/platform"
        }
    ];

    const colorMap: Record<string, { bg: string; border: string; icon: string; iconHover: string }> = {
        amber: { bg: 'bg-amber-500/10', border: 'hover:border-amber-500/50', icon: 'text-amber-400', iconHover: 'group-hover:text-amber-300' },
        blue: { bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50', icon: 'text-blue-400', iconHover: 'group-hover:text-blue-300' },
        green: { bg: 'bg-green-500/10', border: 'hover:border-green-500/50', icon: 'text-green-400', iconHover: 'group-hover:text-green-300' },
        cyan: { bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/50', icon: 'text-cyan-400', iconHover: 'group-hover:text-cyan-300' }
    };

    return (
        <section className="py-24 bg-gray-950 border-t border-gray-800/50" aria-labelledby="product-suite-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <Cpu size={14} className="text-cyan-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Product Suite</span>
                    </div>
                    <h2 id="product-suite-heading" className="text-4xl font-bold text-white mb-4">
                        The Trust Operating System
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Four specialized modules working in concert to de-risk your deployment lifecycle.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const colors = colorMap[product.color];
                        const Icon = product.icon;
                        return (
                            <Link key={product.id} href={product.href} className="group" aria-label={`Learn more about ${product.title}`}>
                                <div className={`bg-gray-900/50 h-full p-8 rounded-xl border border-gray-800 ${colors.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-gray-900/80`}>
                                    <div className={`mb-6 ${colors.bg} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                                        <Icon size={24} className={`${colors.icon} ${colors.iconHover} transition-colors`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.features.map((feature, idx) => (
                                            <span key={idx} className="text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 group-hover:text-cyan-400 transition-colors">
                                        <span>Learn more</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
