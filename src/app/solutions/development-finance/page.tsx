import Link from 'next/link';
import { ArrowRight, Globe, Target, BarChart3, Users, Heart, CheckCircle, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'For Development Finance | Gitance',
    description: 'Deploy impact capital with accountability. Monitor project health and maximize outcomes per dollar.',
};

export default function DevelopmentFinancePage() {
    const features = [
        {
            icon: Target,
            title: 'Implementing Partner Vetting',
            description: 'Comprehensive assessment of NGOs, contractors, and local partners.'
        },
        {
            icon: BarChart3,
            title: 'Project Health Monitoring',
            description: 'Continuous tracking of project milestones and partner performance.'
        },
        {
            icon: Heart,
            title: 'Impact Verification',
            description: 'Evidence-based tracking of development outcomes and beneficiary reach.'
        },
        {
            icon: Users,
            title: 'Stakeholder Mapping',
            description: 'Visualize relationships between project stakeholders and beneficiaries.'
        }
    ];

    const useCases = [
        {
            title: 'DFIs',
            description: 'Vet investees and monitor portfolio company ESG performance.',
            benefits: ['Pre-investment screening', 'ESG monitoring', 'Impact reporting', 'Climate risk assessment', 'Governance scoring']
        },
        {
            title: 'MDBs',
            description: 'Track project implementation across multiple countries.',
            benefits: ['Multi-country oversight', 'Implementing partner health', 'Disbursement readiness', 'Progress milestones', 'Fiduciary compliance']
        },
        {
            title: 'Impact Funds',
            description: 'Measure and verify impact outcomes for portfolio companies.',
            benefits: ['Impact verification', 'Additionality assessment', 'Fund reporting', 'SDG alignment', 'Beneficiary tracking']
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-600/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 mb-6 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2">
                                <Globe size={16} className="text-green-300" />
                                <span className="text-white text-sm font-semibold tracking-wide">For Development Finance</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Deploy Impact.
                                <br />
                                <span className="text-green-400">With Accountability.</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                Structured trust intelligence for DFIs, MDBs, and impact investors. Know your implementing partners and track project health.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link
                                    href="/auth/register?solution=development-finance"
                                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105"
                                >
                                    <span>Request Demo</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="mailto:impact@gitance.com"
                                    className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                                >
                                    Contact Us
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-white">35+</div>
                                    <p className="text-green-400 text-sm mt-1">Markets</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">$1.2B</div>
                                    <p className="text-green-400 text-sm mt-1">Deployed</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">2.4M</div>
                                    <p className="text-green-400 text-sm mt-1">Beneficiaries</p>
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
                                    <span className="text-gray-500 text-xs font-mono">Impact Dashboard</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                                        <div className="text-4xl font-bold text-white mb-1">2,400,000</div>
                                        <div className="text-sm text-green-400">Lives Impacted</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-800/50 rounded-lg">
                                            <div className="text-xs text-gray-400 mb-1">Active Projects</div>
                                            <div className="text-2xl font-bold text-white">147</div>
                                        </div>
                                        <div className="p-3 bg-gray-800/50 rounded-lg">
                                            <div className="text-xs text-gray-400 mb-1">Partners Vetted</div>
                                            <div className="text-2xl font-bold text-white">892</div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">Portfolio Health</span>
                                            <span className="text-green-400 font-bold">94%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                                        </div>
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
                        <div className="inline-flex items-center space-x-2 mb-4 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5">
                            <Target size={14} className="text-green-300" />
                            <span className="text-white text-xs font-semibold uppercase tracking-wider">Capabilities</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Development Impact Tools</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Purpose-built for development finance institutions and impact investors.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-green-500/30 transition-all duration-300 group">
                                    <Icon className="text-green-400 group-hover:text-green-300 transition-colors mb-4" size={32} />
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
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Impact at Scale</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Tailored solutions for different development finance mandates.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-green-500/30 transition-all duration-300">
                                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                                <p className="text-gray-400 mb-6">{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
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
                    <div className="inline-flex items-center space-x-2 mb-6 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5">
                        <Sparkles size={14} className="text-green-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Maximize
                        <br />
                        <span className="text-green-400">Development Impact?</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join leading DFIs and impact investors using Gitance for accountable capital deployment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/register?solution=development-finance"
                            className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105"
                        >
                            <span>Request Demo</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="mailto:impact@gitance.com"
                            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
