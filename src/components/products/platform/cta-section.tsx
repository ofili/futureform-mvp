import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PlatformCTA() {
  return (
    <section className="bg-gradient-to-b from-gray-950 to-midnight py-24 border-t border-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
          <Sparkles size={14} className="text-cyan-300" />
          <span className="text-white text-xs font-semibold uppercase tracking-wider">Get Started</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Power Your
          <br />
          <span className="text-cyan-400">Trust Intelligence?</span>
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Get access to the Gitance Engine and start building trust-aware applications today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register?product=platform"
            className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
          >
            <span>Start Building</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/docs"
            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
          >
            View Documentation
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Free tier available • No credit card required • Full API access
        </p>
      </div>
    </section>
  );
}