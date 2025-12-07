import Link from 'next/link';
import { ArrowRight, Cpu, Zap, Database, Globe } from 'lucide-react';

export function PlatformHero() {
  return (
    <section className="bg-midnight min-h-[85vh] flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2">
              <Cpu size={16} className="text-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold tracking-wide">Core Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gitance
              <br />
              <span className="text-cyan-400">Engine.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              The intelligent core that powers all Gitance products. AI-driven trust intelligence, global data processing, and partner ecosystem orchestration at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth/signup?product=platform"
                className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-all font-bold flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:text-white hover:bg-white/5 transition-all font-semibold"
              >
                View Documentation
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white">99.99%</div>
                <p className="text-cyan-400 text-sm mt-1">Uptime SLA</p>
              </div>
              <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                <div className="text-3xl font-bold text-white">&lt;100ms</div>
                <p className="text-cyan-400 text-sm mt-1">Latency</p>
              </div>
              <div className="text-center sm:text-left border-l border-gray-800 pl-6">
                <div className="text-3xl font-bold text-white">SOC 2</div>
                <p className="text-cyan-400 text-sm mt-1">Compliant</p>
              </div>
            </div>
          </div>

          {/* Right - Engine Architecture Diagram */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Central Processing Core */}
              <div className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Cpu size={16} className="text-cyan-400" />
                    Engine Architecture
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400 text-xs">Active</span>
                  </div>
                </div>

                {/* Architecture Layers */}
                <div className="space-y-4">
                  {/* Data Ingestion Layer */}
                  <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Database size={18} className="text-cyan-400" />
                      <span className="text-white text-sm font-medium">Data Ingestion</span>
                    </div>
                    <div className="flex gap-2">
                      {['APIs', 'Documents', 'Signals'].map((item) => (
                        <span key={item} className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Processing Layer */}
                  <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap size={18} className="text-cyan-400" />
                      <span className="text-white text-sm font-medium">AI Processing</span>
                    </div>
                    <div className="flex gap-2">
                      {['Parser', 'Scorer', 'Analyzer'].map((item) => (
                        <span key={item} className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Output Layer */}
                  <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe size={18} className="text-cyan-400" />
                      <span className="text-white text-sm font-medium">Intelligence Output</span>
                    </div>
                    <div className="flex gap-2">
                      {['Reports', 'Scores', 'Alerts'].map((item) => (
                        <span key={item} className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Processing Indicator */}
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                  <span>Processing: 2.4K requests/sec</span>
                  <span className="text-cyan-400">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}