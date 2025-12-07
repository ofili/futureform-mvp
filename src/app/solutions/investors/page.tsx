import Link from 'next/link';
import { ArrowRight, Briefcase, TrendingUp, Shield, Target, BarChart3, CheckCircle, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'For Investors | Gitance',
    description: 'De-risk deals and protect portfolio performance with AI-powered partner intelligence.',
};

export default function InvestorsPage() {
    const features = [
        {
            icon: TrendingUp,
            title: 'M&A Due Diligence',
            description: 'Comprehensive partner assessment across 6 trust dimensions before acquisition decisions.'
        },
        {
            icon: Shield,
            title: 'Portfolio Risk Monitoring',
            description: 'Continuous monitoring of portfolio company partnerships and vendor relationships.'
        },
        {
            icon: Target,
            title: 'Deal Flow Screening',
            description: 'Rapid trust scoring for preliminary vetting of potential investment targets.'
        },
        {
            icon: BarChart3,
            title: 'Exit Readiness',
            description: 'Partner ecosystem health reports for exit preparation and buyer due diligence.'
        }
    ];

    const useCases = [
        {
            title: 'Private Equity',
            description: 'Vet acquisition targets and monitor portfolio company partnerships.',
            benefits: ['Pre-deal partner analysis', 'Post-acquisition monitoring', 'Value creation tracking', 'Management team assessment', 'Vendor concentration risk']
        },
        {
            title: 'Venture Capital',
            description: 'Evaluate startup partnerships and supplier relationships.',
            benefits: ['Founder network mapping', 'Customer concentration risk', 'Key vendor assessment', 'Series readiness scoring', 'Cap table verification']
        },
        {
            title: 'Family Offices',
            description: 'Protect generational wealth with structured due diligence.',
            benefits: ['Co-investor vetting', 'Manager assessment', 'Deal quality scoring', 'Conflict of interest checks', 'Long-term partner monitoring']
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 mb-6 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2">
                                <Briefcase size={16} className="text-amber-300" />
                                <span className="text-white text-sm font-semibold tracking-wide">For Investors</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                De-Risk Deals.
                                <br />
                                <span className="text-amber-400">Protect Returns.</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                AI-powered partner intelligence for investment professionals. Know your partners before you commit capital.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link
                                    href="/auth/signup?solution=investors"
                                    className="px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105"
                                >
                                    <span>Start Free Trial</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="mailto:investors@gitance.com"
                                    className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                                >
                                    Talk to Sales
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-white">$2.4B+</div>
                                    <p className="text-amber-400 text-sm mt-1">Deals Analyzed</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">340+</div>
                                    <p className="text-amber-400 text-sm mt-1">PE/VC Clients</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">87%</div>
                                    <p className="text-amber-400 text-sm mt-1">Risk Reduction</p>
                                </div>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="hidden lg:block">
                            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-500 text-xs font-mono">Deal Analysis</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Target Company A</span>
                                            <span className="text-green-400 font-bold">92</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                        <p className="text-xs text-green-400 mt-2">✓ Low Risk - Proceed with confidence</p>
                                    </div>

                                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Target Company B</span>
                                            <span className="text-amber-400 font-bold">67</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }}></div>
                                        </div>
                                        <p className="text-xs text-amber-400 mt-2">⚠ Medium Risk - Additional DD required</p>
                                    </div>

                                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Target Company C</span>
                                            <span className="text-red-400 font-bold">34</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '34%' }}></div>
                                        </div>
                                        <p className="text-xs text-red-400 mt-2">✗ High Risk - Red flags detected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-950 py-24 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 mb-4 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5">
                            <TrendingUp size={14} className="text-amber-300" />
                            <span className="text-white text-xs font-semibold uppercase tracking-wider">Capabilities</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Investment Intelligence Tools</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Purpose-built for the investment lifecycle from deal sourcing to exit.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-amber-500/30 transition-all duration-300 group">
                                    <Icon className="text-amber-400 group-hover:text-amber-300 transition-colors mb-4" size={32} />
                                    <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-midnight py-24 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Your Investment Strategy</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Tailored intelligence for every type of investment professional.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-amber-500/30 transition-all duration-300 group">
                                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                                <p className="text-gray-400 mb-6">{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
                                            <span className="text-gray-300 text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-b from-gray-950 to-midnight py-24 border-t border-gray-800/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 mb-6 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5">
                        <Sparkles size={14} className="text-amber-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to De-Risk
                        <br />
                        <span className="text-amber-400">Your Next Deal?</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join 340+ investment professionals using Gitance to make smarter partnership decisions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup?solution=investors"
                            className="px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105"
                        >
                            <span>Start Free Trial</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="mailto:investors@gitance.com"
                            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
