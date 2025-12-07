import Link from 'next/link';
import { ArrowRight, Globe, Shield, Activity, CheckCircle, Cpu, TrendingUp, Eye } from 'lucide-react';

export function Hero() {
    return (
        <section className="bg-midnight min-h-[90vh] flex items-center pt-24 pb-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2">
                            <Cpu size={16} className="text-cyan-400" />
                            <span className="text-cyan-400 text-sm font-semibold tracking-wide">Gitance Intelligence</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            The Operating System
                            <br />
                            <span className="text-cyan-400">For Trust.</span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                            Turn fragmented signals into structured, decision-ready intelligence. AI-powered partner vetting, deployment monitoring, and trust verification for frontier markets.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                href="/auth/signup"
                                className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
                            >
                                <span>Start Free</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/products/partner-intelligence"
                                className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                            >
                                Explore Products
                            </Link>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                            <div className="text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-3xl font-bold text-white">
                                    <Globe size={24} className="text-cyan-400" />
                                    <span>35+</span>
                                </div>
                                <p className="text-cyan-400 text-sm mt-1">Markets Covered</p>
                            </div>
                            <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                <div className="text-3xl font-bold text-white">6</div>
                                <p className="text-cyan-400 text-sm mt-1">Trust Layers</p>
                            </div>
                            <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <p className="text-cyan-400 text-sm mt-1">Monitoring</p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Trust Intelligence Dashboard */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Main Dashboard Visual */}
                            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400 text-xs font-mono">Live</span>
                                    </div>
                                </div>

                                {/* Trust Score Display */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-4 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                                        <div>
                                            <div className="text-4xl font-bold text-white">87</div>
                                            <div className="text-xs text-cyan-400 uppercase tracking-wider">Trust Score</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Layers */}
                                <div className="space-y-3 mb-6">
                                    {[
                                        { name: 'Reliability', score: 92, color: 'bg-green-500' },
                                        { name: 'Governance', score: 85, color: 'bg-cyan-500' },
                                        { name: 'Competence', score: 88, color: 'bg-blue-500' },
                                        { name: 'Integrity', score: 78, color: 'bg-amber-500' },
                                    ].map((layer) => (
                                        <div key={layer.name} className="flex items-center gap-3">
                                            <span className="text-gray-400 text-sm w-24">{layer.name}</span>
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${layer.color} rounded-full`} style={{ width: `${layer.score}%` }}></div>
                                            </div>
                                            <span className="text-white text-sm font-mono w-8">{layer.score}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Verification Status */}
                                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <CheckCircle size={18} className="text-green-400" />
                                    <span className="text-green-300 text-sm">All 36 evidence items verified</span>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -right-4 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Activity size={16} className="text-blue-400" />
                                    <span className="text-white text-xs font-semibold">Live Sync</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-amber-400" />
                                    <span className="text-white text-xs font-semibold">6 Layers Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
