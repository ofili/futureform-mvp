import Link from 'next/link';
import { ArrowRight, Landmark, Shield, FileCheck, Scale, Users, CheckCircle, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'For Governments | Gitance',
    description: 'Strengthen procurement transparency and reduce corruption exposure with structured trust intelligence.',
};

export default function GovernmentsPage() {
    const features = [
        {
            icon: Shield,
            title: 'Procurement Vetting',
            description: 'Comprehensive contractor assessment before awarding public contracts.'
        },
        {
            icon: FileCheck,
            title: 'Compliance Verification',
            description: 'Automated verification of licensing, certifications, and regulatory standing.'
        },
        {
            icon: Scale,
            title: 'Transparency Scoring',
            description: 'Measure and benchmark contractor transparency against international standards.'
        },
        {
            icon: Users,
            title: 'Beneficial Ownership',
            description: 'Identify ultimate beneficial owners and detect potential conflicts of interest.'
        }
    ];

    const useCases = [
        {
            title: 'Procurement Offices',
            description: 'Vet contractors and suppliers before awarding public contracts.',
            benefits: ['Contractor screening', 'Bid evaluation', 'Conflict detection', 'Debarment checks', 'Financial stability assessment']
        },
        {
            title: 'State Enterprises',
            description: 'Monitor vendor relationships and partnership health.',
            benefits: ['Vendor management', 'Performance tracking', 'Risk alerts', 'Contract compliance', 'Renewal readiness']
        },
        {
            title: 'Ministries',
            description: 'Ensure policy compliance across departments and agencies.',
            benefits: ['Cross-agency visibility', 'Audit readiness', 'Reporting dashboards', 'Budget alignment', 'Stakeholder transparency']
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 mb-6 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-2">
                                <Landmark size={16} className="text-blue-300" />
                                <span className="text-white text-sm font-semibold tracking-wide">For Governments</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Strengthen Procurement.
                                <br />
                                <span className="text-blue-400">Reduce Corruption.</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                Evidence-based contractor vetting for public institutions. Make procurement decisions with transparency and accountability.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link
                                    href="/auth/signup?solution=governments"
                                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105"
                                >
                                    <span>Request Demo</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="mailto:government@gitance.com"
                                    className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                                >
                                    Contact Us
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-center sm:text-left">
                                    <div className="text-3xl font-bold text-white">12</div>
                                    <p className="text-blue-400 text-sm mt-1">Countries</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">50k+</div>
                                    <p className="text-blue-400 text-sm mt-1">Contractors</p>
                                </div>
                                <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                    <div className="text-3xl font-bold text-white">94%</div>
                                    <p className="text-blue-400 text-sm mt-1">Risk Detection</p>
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
                                    <span className="text-gray-500 text-xs font-mono">Procurement Dashboard</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                        <h4 className="text-white font-semibold mb-2">Tender #2024-0847</h4>
                                        <p className="text-gray-400 text-sm mb-3">Infrastructure Development Project</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-2 bg-gray-800/50 rounded">
                                                <div className="text-xs text-gray-400">Bidders Screened</div>
                                                <div className="text-lg font-bold text-white">24</div>
                                            </div>
                                            <div className="p-2 bg-gray-800/50 rounded">
                                                <div className="text-xs text-gray-400">Qualified</div>
                                                <div className="text-lg font-bold text-green-400">18</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                                            <CheckCircle className="text-green-400 mx-auto mb-1" size={20} />
                                            <div className="text-xs text-gray-400">Clear Records</div>
                                            <div className="text-lg font-bold text-white">18</div>
                                        </div>
                                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
                                            <Shield className="text-red-400 mx-auto mb-1" size={20} />
                                            <div className="text-xs text-gray-400">Flagged</div>
                                            <div className="text-lg font-bold text-white">6</div>
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
                        <div className="inline-flex items-center space-x-2 mb-4 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-1.5">
                            <Shield size={14} className="text-blue-300" />
                            <span className="text-white text-xs font-semibold uppercase tracking-wider">Capabilities</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Public Sector Trust Tools</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Purpose-built for transparency, accountability, and public trust.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
                                    <Icon className="text-blue-400 group-hover:text-blue-300 transition-colors mb-4" size={32} />
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
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Public Institutions</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Tailored solutions for different government functions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {useCases.map((useCase) => (
                            <div key={useCase.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 transition-all duration-300">
                                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                                <p className="text-gray-400 mb-6">{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />
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
                    <div className="inline-flex items-center space-x-2 mb-6 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-1.5">
                        <Sparkles size={14} className="text-blue-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Strengthen
                        <br />
                        <span className="text-blue-400">Public Procurement?</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join governments worldwide using Gitance for transparent, accountable procurement.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup?solution=governments"
                            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105"
                        >
                            <span>Request Demo</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="mailto:government@gitance.com"
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
