import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, Lock, Eye } from 'lucide-react';

export function TrustSignalsHero() {
  return (
    <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 mb-6 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
              <Shield size={16} className="text-green-400" />
              <span className="text-green-400 text-sm font-semibold tracking-wide">Trust Signals</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Evidence-Based
              <br />
              <span className="text-green-400">Trust Verification.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              Multi-layer trust scoring and security verification. Make confident partnership decisions backed by comprehensive data and verified evidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth/register?product=trust-signals"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105"
              >
                <span>Start Verification</span>
                <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold">
                Schedule Demo
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <p className="text-gray-500 text-sm mt-1">Evidence-Based</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-green-400">6</div>
                <p className="text-gray-500 text-sm mt-1">Trust Dimensions</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-green-400">36</div>
                <p className="text-gray-500 text-sm mt-1">Questions</p>
              </div>
            </div>
          </div>

          {/* Right - Trust Verification Badges */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main Badge Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Verified Badge */}
                <div className="bg-gray-900/80 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <span className="text-white font-semibold">Verified</span>
                  </div>
                  <p className="text-gray-400 text-sm">All evidence reviewed and validated</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 text-xs font-mono">95%</span>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="bg-gray-900/80 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Lock size={20} className="text-green-400" />
                    </div>
                    <span className="text-white font-semibold">Secure</span>
                  </div>
                  <p className="text-gray-400 text-sm">Security protocols confirmed</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[88%] bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 text-xs font-mono">88%</span>
                  </div>
                </div>

                {/* Transparent Badge */}
                <div className="bg-gray-900/80 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Eye size={20} className="text-green-400" />
                    </div>
                    <span className="text-white font-semibold">Transparent</span>
                  </div>
                  <p className="text-gray-400 text-sm">Clear operational visibility</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 text-xs font-mono">92%</span>
                  </div>
                </div>

                {/* Compliant Badge */}
                <div className="bg-gray-900/80 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Shield size={20} className="text-green-400" />
                    </div>
                    <span className="text-white font-semibold">Compliant</span>
                  </div>
                  <p className="text-gray-400 text-sm">Regulatory standards met</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[100%] bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 text-xs font-mono">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}