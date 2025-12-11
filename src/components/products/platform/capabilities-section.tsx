import { Cpu, Brain, Database, Zap, Shield, Globe } from 'lucide-react';

export function PlatformCapabilities() {
  const capabilities = [
    {
      icon: Brain,
      title: 'AI Trust Intelligence',
      description: 'Advanced machine learning models trained on frontier market data for accurate trust assessment.'
    },
    {
      icon: Database,
      title: 'Data Processing',
      description: 'High-throughput data ingestion with automated parsing, extraction, and normalization.'
    },
    {
      icon: Zap,
      title: 'Real-Time Scoring',
      description: 'Sub-100ms trust score calculations with continuous updates as new data arrives.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II compliant with end-to-end encryption and role-based access control.'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Data sources and processing capabilities spanning 35+ frontier markets worldwide.'
    },
    {
      icon: Cpu,
      title: 'API-First Design',
      description: 'RESTful APIs with webhooks, SDKs, and comprehensive documentation for integration.'
    }
  ];

  return (
    <section className="bg-gray-950 py-24 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4 bg-cyan/20 border border-cyan/40 rounded-full px-4 py-1.5">
            <Cpu size={14} className="text-cyan" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">Capabilities</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Built for Scale & Performance</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Enterprise-grade infrastructure powering trust intelligence across frontier markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-cyan-500/30 transition-colors group"
            >
              <cap.icon className="text-cyan group-hover:text-cyan transition-colors mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">{cap.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}