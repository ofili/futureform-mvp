import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Users, Globe } from 'lucide-react';

export function PartnerIntelligenceHero() {
  return (
    <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2">
              <Shield size={16} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold tracking-wide">Partner Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Know Your Partners
              <br />
              <span className="text-amber-400">Before You Commit.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              AI-powered due diligence across 6 trust dimensions. Evaluate strategic partners with comprehensive data analysis and sector-specific insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth/signup?product=partner-intelligence"
                className="px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105"
              >
                <span>Start Assessment</span>
                <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold">
                Schedule Demo
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-400">6</div>
                <p className="text-gray-500 text-sm mt-1">Trust Layers</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-400">35+</div>
                <p className="text-gray-500 text-sm mt-1">Markets</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-400">8</div>
                <p className="text-gray-500 text-sm mt-1">Sectors</p>
              </div>
            </div>
          </div>

          {/* Right - Trust Radar Visualization */}
          <div className="hidden lg:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
              <div className="absolute inset-8 border border-amber-500/15 rounded-full"></div>
              <div className="absolute inset-16 border border-dashed border-amber-500/10 rounded-full"></div>
              
              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-midnight border-2 border-amber-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                <div className="text-2xl font-bold text-amber-400">87</div>
              </div>

              {/* Trust Dimension Nodes */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg px-3 py-2 text-center">
                  <Shield size={16} className="text-amber-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">Reliability</span>
                </div>
              </div>
              
              <div className="absolute top-1/4 right-0 translate-x-2">
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg px-3 py-2 text-center">
                  <TrendingUp size={16} className="text-amber-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">Competence</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 right-0 translate-x-2">
                <div className="bg-gray-900 border border-green-500/30 rounded-lg px-3 py-2 text-center">
                  <Users size={16} className="text-green-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">Governance</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg px-3 py-2 text-center">
                  <Globe size={16} className="text-amber-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">Ecosystem</span>
                </div>
              </div>

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <polygon
                  points="50,10 85,30 85,70 50,90 15,70 15,30"
                  fill="rgba(245,158,11,0.1)"
                  stroke="rgba(245,158,11,0.3)"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}