import Link from 'next/link';
import { ArrowRight, Activity, Globe, Zap } from 'lucide-react';

export function DeploymentInsightsHero() {
    return (
        <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center space-x-2 mb-6 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                            <Activity size={16} className="text-blue-400" />
                            <span className="text-blue-400 text-sm font-semibold tracking-wide">Deployment Insights</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Track Deployments
                            <br />
                            <span className="text-blue-400">In Real-Time.</span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                            Monitor integration status, deployment health, and market performance across 35+ frontier markets. Never miss a critical signal.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                href="/auth/signup?product=deployment-insights"
                                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105"
                            >
                                <span>Start Monitoring</span>
                                <ArrowRight size={18} />
                            </Link>
                            <button className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold">
                                Schedule Demo
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center sm:text-left">
                                <div className="text-3xl font-bold text-blue-400">35+</div>
                                <p className="text-gray-500 text-sm mt-1">Markets</p>
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-3xl font-bold text-blue-400">24/7</div>
                                <p className="text-gray-500 text-sm mt-1">Monitoring</p>
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="flex items-center gap-1 text-3xl font-bold text-blue-400">
                                    <Zap size={24} />
                                    <span>Live</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">Sync</p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Deployment Activity Visualization */}
                    <div className="hidden lg:block">
                        <div className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold">Deployment Activity</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-xs">Live</span>
                                </div>
                            </div>

                            {/* Activity Graph Bars */}
                            <div className="flex items-end gap-2 h-40 mb-6">
                                {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 72].map((height, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/80 rounded-t transition-all hover:from-blue-500/70 hover:to-blue-400"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>

                            {/* Market Status Grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { market: 'NG', status: 'active' },
                                    { market: 'KE', status: 'active' },
                                    { market: 'ZA', status: 'active' },
                                    { market: 'GH', status: 'warning' },
                                    { market: 'EG', status: 'active' },
                                    { market: 'TZ', status: 'active' },
                                    { market: 'RW', status: 'active' },
                                    { market: 'UG', status: 'inactive' },
                                ].map((item) => (
                                    <div
                                        key={item.market}
                                        className={`p-2 rounded text-center text-xs font-mono ${item.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                item.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                    'bg-gray-800 text-gray-500 border border-gray-700'
                                            }`}
                                    >
                                        {item.market}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
