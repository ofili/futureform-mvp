import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="bg-midnight min-h-[85vh] flex items-center py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-block px-3 py-1 mb-6 border border-cyan-500/30 rounded-full bg-cyan-500/10 backdrop-blur-sm">
                            <span className="text-green-400 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                System Status: Operational
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Gitance <br />
                            <span className="text-cyan-400">Intelligence.</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                            The operating system for trust in frontier markets. We turn fragmented signals into structured, decision-ready intelligence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold h-12 px-8 text-base transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                                Explore Products
                            </Button>
                            <Button size="lg" variant="outline" className="border-gray-700 text-black-300 hover:text-white hover:bg-white/10 h-12 px-8 text-base">
                                Talk to Sales
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Live Monitoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-cyan-500/80">35</span>
                                <span>Markets Covered</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Graph Visualization */}
                    <div className="hidden lg:block relative">
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 border border-gray-800 rounded-full animate-[spin_60s_linear_infinite] opacity-30"></div>
                            <div className="absolute inset-12 border border-dashed border-gray-700 rounded-full animate-[spin_40s_linear_infinite_reverse] opacity-40"></div>

                            {/* Central Intelligence Node */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-midnight border-2 border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,217,255,0.2)]">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                            </div>

                            {/* Orbiting Satellite Nodes */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-12 h-12 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center text-xs text-yellow-400 font-mono">
                                98%
                            </div>
                            <div className="absolute bottom-1/4 right-0 w-auto px-3 py-1 bg-gray-900 border border-red-500/50 rounded text-xs text-red-400 font-mono flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                RISK DETECTED
                            </div>
                            <div className="absolute top-1/3 left-0 -translate-x-4 w-auto px-3 py-1 bg-gray-900 border border-green-500/50 rounded text-xs text-green-400 font-mono flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                VERIFIED
                            </div>

                            {/* Connecting Lines (SVG) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                <line x1="50%" y1="50%" x2="50%" y2="0%" stroke="#00D9FF" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="100%" y2="75%" stroke="#EF4444" strokeWidth="1" />
                                <line x1="50%" y1="50%" x2="0%" y2="33%" stroke="#10B981" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
