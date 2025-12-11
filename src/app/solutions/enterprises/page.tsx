import Link from 'next/link';
import { ArrowRight, Building2, Shield, Truck, Users, Globe, CheckCircle, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'For Enterprises | Gitance',
    description: 'Verify suppliers, assess joint venture partners, and protect supply chain integrity.',
};

export default function EnterprisesPage() {
    const features = [
        {
            icon: Truck,
            title: 'Supplier Verification',
            description: 'Comprehensive vetting of suppliers across trust dimensions and compliance.'
        },
        {
            icon: Users,
            title: 'JV Partner Assessment',
            description: 'Evaluate potential joint venture partners before strategic commitments.'
        },
        {
            icon: Globe,
            title: 'Supply Chain Visibility',
            description: 'Map and monitor your entire supplier network across geographies.'
        },
        {
            icon: Shield,
            title: 'Third-Party Risk',
            description: 'Continuous monitoring and risk scoring for critical third parties.'
        }
    ];

    const useCases = [
        {
            title: 'Procurement',
            description: 'Vet suppliers and service providers before onboarding.',
            benefits: ['Supplier screening', 'Compliance verification', 'Onboarding acceleration', 'Due diligence automation', 'Vendor categorization']
        },
        {
            title: 'Strategic Partnerships',
            description: 'Assess potential JV and alliance partners.',
            benefits: ['Partner due diligence', 'Cultural fit assessment', 'Risk mapping', 'Synergy analysis', 'Reference verification']
        },
        {
            title: 'Supply Chain',
            description: 'Monitor supplier health and detect risks early.',
            benefits: ['Tier-N visibility', 'Disruption early warning', 'Concentration risk', 'Geographic risk mapping', 'ESG compliance tracking']
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-2">
                                <Building2 size={16} className="text-cyan-300" />
                                <span className="text-white text-sm font-semibold tracking-wide">For Enterprises</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Verify Suppliers.
                                <br />
                                <span className="text-cyan-400">Protect Supply Chains.</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                Enterprise-grade trust intelligence for supplier verification, JV partner assessment, and third-party risk management.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link
                                    href="/auth/register?solution=enterprises"
                                    className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
                                >
                                    <span>Start Free Trial</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="mailto:enterprise@gitance.com"
                                    className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                                >
                                    Talk to Sales
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-white">500+</div>
                                    <p className="text-cyan-400 text-sm mt-1">Enterprises</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">120k</div>
                                    <p className="text-cyan-400 text-sm mt-1">Suppliers Vetted</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">78%</div>
                                    <p className="text-cyan-400 text-sm mt-1">Faster Onboarding</p>
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
                                    <span className="text-gray-500 text-xs font-mono">Supplier Network</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                                            <div className="text-2xl font-bold text-white">847</div>
                                            <div className="text-xs text-green-400">Verified</div>
                                        </div>
                                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-center">
                                            <div className="text-2xl font-bold text-white">45</div>
                                            <div className="text-xs text-amber-400">Review</div>
                                        </div>
                                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
                                            <div className="text-2xl font-bold text-white">12</div>
                                            <div className="text-xs text-red-400">Flagged</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-800/50 rounded-lg">
                                        <div className="text-sm text-gray-400 mb-3">Supply Chain Health by Region</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 w-20">APAC</span>
                                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '92%' }}></div>
                                                </div>
                                                <span className="text-xs text-white w-8">92%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 w-20">EMEA</span>
                                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '88%' }}></div>
                                                </div>
                                                <span className="text-xs text-white w-8">88%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 w-20">Americas</span>
                                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '95%' }}></div>
                                                </div>
                                                <span className="text-xs text-white w-8">95%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                        <CheckCircle size={18} className="text-cyan-400" />
                                        <span className="text-cyan text-sm">All Tier-1 suppliers verified</span>
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
                        <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                            <Shield size={14} className="text-cyan" />
                            <span className="text-white text-xs font-semibold uppercase tracking-wider">Capabilities</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Enterprise Trust Tools</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Purpose-built for enterprise procurement and supply chain teams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
                                    <Icon className="text-cyan group-hover:text-cyan transition-colors mb-4" size={32} />
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
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Enterprise Teams</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Tailored solutions for different enterprise functions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/30 transition-all duration-300">
                                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                                <p className="text-gray-400 mb-6">{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-cyan flex-shrink-0" />
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
                    <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <Sparkles size={14} className="text-cyan" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Protect Your
                        <br />
                        <span className="text-cyan">Supply Chain?</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join 500+ enterprises using Gitance for supplier verification and third-party risk management.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/register?solution=enterprises"
                            className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
                        >
                            <span>Start Free Trial</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="mailto:enterprise@gitance.com"
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
