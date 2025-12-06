
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ProductSuite() {
    const products = [
        {
            title: "Partner Intelligence",
            description: "Evaluate before you commit. The industry standard for pre-investment partner vetting.",
            features: ["Partner Trust Report", "Risk Score"],
            icon: (
                <svg className="w-8 h-8 text-cyan-600 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: "/products/partner-intelligence"
        },
        {
            title: "Deployment Insights",
            description: "Track real-world performance. Monitoring that doesn't sleep when the contract is signed.",
            features: ["Deployment File", "Activity Graph"],
            icon: (
                <svg className="w-8 h-8 text-cyan-600 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            href: "/products/deployment-insights"
        },
        {
            title: "Trust Signals",
            description: "Raw data, structured. Access the underlying indices and nodes powering our intelligence.",
            features: ["Market Index", "Raw Nodes"],
            icon: (
                <svg className="w-8 h-8 text-cyan-600 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            href: "/products/trust-signals"
        },
        {
            title: "Gitance Engine",
            description: "The core processing power. Automated extraction, parsing, and scoring at scale.",
            features: ["Document Parser", "Signal Extractor"],
            icon: (
                <svg className="w-8 h-8 text-cyan-600 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            href: "/platform/engine"
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        The Trust Operating System
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Four specialized modules working in concert to de-risk your deployment lifecycle.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <Link key={index} href={product.href} className="group">
                            <div className="bg-white h-full p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
                                <div className="mb-6 bg-midnight/5 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-midnight group-hover:scale-110 transition-all duration-300">
                                    {product.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Includes</p>
                                    <ul className="space-y-1">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
