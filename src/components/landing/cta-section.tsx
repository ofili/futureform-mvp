import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
    return (
        <section className="bg-gradient-to-b from-gray-950 to-midnight py-24 border-t border-gray-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                    <Sparkles size={14} className="text-white" />
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                    Stop Betting on Vendor Promises.
                    <br />
                    <span className="text-cyan-400">Start Building on Trust Intelligence.</span>
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    For Fast Decisions: Start AI Assessment in 48 hours.
                    <br />
                    For High-Stakes Deployments: Request Expert Analysis.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/auth/register"
                        className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
                    >
                        <span>Start AI Assessment</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/expert-analysis"
                        className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                    >
                        Request Expert Analysis
                    </Link>
                </div>

                <p className="mt-8 text-gray-500 text-sm">
                    No credit card required for consultation.
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline"> • </span>
                    Trusted by 35+ global partners.
                </p>
            </div>
        </section>
    );
}
