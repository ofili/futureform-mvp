import Link from 'next/link';
import { Shield, Activity, Zap, Cpu, ArrowRight } from 'lucide-react';

export function ProductSuite() {
    const products = [
        {
            id: "assess",
            title: "1. ASSESS Partners",
            description: "Run comprehensive 6-layer assessments on vendors, suppliers, and partners before committing capital.",
            features: ["DTRI Score (0-100)", "Red Flag Detection", "Market Benchmarking"],
            icon: Shield,
            color: 'cyan',
            href: "/auth/register"
        },
        {
            id: "monitor",
            title: "2. MONITOR Deployments",
            description: "Track deployment health, partner performance, and trust signal evolution across all your projects.",
            features: ["Live Trust Scores", "Degradation Alerts", "Portfolio Dashboards"],
            icon: Activity,
            color: 'blue',
            href: "/contact"
        },
        {
            id: "verify",
            title: "3. VERIFY Intent",
            description: "Expert forensic investigation for high-stakes deployments. Includes Strategic Intent analysis.",
            features: ["Strategic Intent Forensics", "Incentive Analysis", "Reference Verification"],
            icon: Zap,
            color: 'purple',
            href: "/expert-analysis"
        }
    ];

    const colors: Record<string, { bg: string; border: string; icon: string; iconHover: string }> = {
        cyan: { bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/50', icon: 'text-cyan-400', iconHover: 'group-hover:text-cyan-300' },
        blue: { bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50', icon: 'text-blue-400', iconHover: 'group-hover:text-blue-300' },
        purple: { bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50', icon: 'text-purple-400', iconHover: 'group-hover:text-purple-300' }
    };

    return (
        <section id="products" className="py-24 bg-midnight relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <Cpu size={14} className="text-white" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Platform Overview</span>
                    </div>
                    <h2 id="product-suite-heading" className="text-4xl font-bold text-white mb-4">
                        One Platform. Three Intelligence Workflows.
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Complete deployment risk visibility from vetting to continuous oversight.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product) => {
                        const Icon = product.icon;
                        const colorSet = colors[product.color];
                        return (
                            <Link
                                key={product.id}
                                href={product.href}
                                className={`group block bg-gray-900/50 rounded-2xl p-8 border border-gray-800 ${colorSet.border} hover:bg-gray-900 transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 ${colorSet.bg} rounded-xl flex items-center justify-center mb-6`}>
                                    <Icon className={`${colorSet.icon} ${colorSet.iconHover} transition-colors`} size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{product.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {product.features.map((feature) => (
                                        <li key={feature} className="flex items-center text-gray-300 text-sm">
                                            <div className={`w-1.5 h-1.5 rounded-full ${colorSet.icon.replace('text-', 'bg-')} mr-2`}></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-cyan-400 transition-colors">
                                    Learn More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
