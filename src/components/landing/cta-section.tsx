import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
    return (
        <section className="bg-gradient-to-b from-gray-950 to-midnight py-24 border-t border-gray-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                    <Sparkles size={14} className="text-cyan-300" />
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Stop Betting on Luck.
                    <br />
                    <span className="text-cyan-400">Start With Intelligence.</span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Deploy capital with the confidence of structured intelligence. Get started in minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/auth/register"
                        className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
                    >
                        <span>Start Your Assessment</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="mailto:hello@gitance.com"
                        className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                    >
                        Talk to Sales
                    </Link>
                </div>

                <p className="text-gray-500 text-sm mt-8">
                    No credit card required • 14-day free trial • Full feature access
                </p>
            </div>
        </section>
    );
}
