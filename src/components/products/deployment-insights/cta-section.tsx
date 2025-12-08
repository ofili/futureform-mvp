import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function DeploymentInsightsCTA() {
    return (
        <section className="bg-gradient-to-b from-gray-950 to-midnight py-24 border-t border-gray-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center space-x-2 mb-6 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
                    <Sparkles size={14} className="text-blue-400" />
                    <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Get Started</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready for Complete
                    <br />
                    <span className="text-blue-400">Deployment Visibility?</span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Start monitoring your deployments across frontier markets. Set up takes minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/auth/register?product=deployment-insights"
                        className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105"
                    >
                        <span>Start Free Trial</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/pricing"
                        className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
                    >
                        View Pricing
                    </Link>
                </div>

                <p className="text-gray-500 text-sm mt-8">
                    No credit card required • 14-day free trial • Full feature access
                </p>
            </div>
        </section>
    );
}
