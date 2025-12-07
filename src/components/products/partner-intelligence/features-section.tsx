import { FeatureCard } from '@/components/products/shared/feature-card';
import { Shield, TrendingUp, Zap, BarChart3, Brain, Globe, FileCheck, AlertTriangle } from 'lucide-react';

export function PartnerIntelligenceFeatures() {
  const features = [
    {
      icon: Shield,
      title: 'Multi-Layer Trust Assessment',
      description: 'Evaluate partners across 6 comprehensive trust dimensions: Reliability, Transparency, Governance, Competence, Integrity, and Ecosystem.',
      color: 'amber' as const
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models analyze partner data, historical performance, and market signals for accurate risk assessment.',
      color: 'amber' as const
    },
    {
      icon: Globe,
      title: 'Sector-Specific Insights',
      description: 'Industry-tailored assessment frameworks for 8+ sectors including Finance, Healthcare, Energy, and Government.',
      color: 'amber' as const
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Scoring',
      description: 'Dynamic trust scores that update as new data becomes available, keeping your partnership assessments current.',
      color: 'amber' as const
    },
    {
      icon: BarChart3,
      title: 'Comparative Analytics',
      description: 'Benchmark partners against industry standards and peer groups to identify competitive advantages.',
      color: 'amber' as const
    },
    {
      icon: FileCheck,
      title: 'Partner Trust Report',
      description: 'Comprehensive PDF reports with executive summaries, risk matrices, and actionable recommendations.',
      color: 'amber' as const
    }
  ];

  return (
    <section className="bg-gray-950 py-24 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
            <Zap size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Capabilities</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Intelligence Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to evaluate and manage strategic partnerships with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}