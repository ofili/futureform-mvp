import { FeatureCard } from '@/components/products/shared/feature-card';
import { Shield, FileCheck, BarChart3, Lock, Eye, Scale } from 'lucide-react';

export function TrustSignalsFeatures() {
  const features = [
    {
      icon: Shield,
      title: '6-Layer Trust Framework',
      description: 'Comprehensive assessment across Reliability, Transparency, Governance, Competence, Integrity, and Ecosystem dimensions.',
      color: 'green' as const
    },
    {
      icon: FileCheck,
      title: 'Evidence Collection',
      description: 'Structured evidence gathering with document verification, API validation, and third-party attestations.',
      color: 'green' as const
    },
    {
      icon: BarChart3,
      title: 'Trust Scoring',
      description: 'Quantified trust scores for each dimension with industry benchmarks and trend analysis.',
      color: 'green' as const
    },
    {
      icon: Lock,
      title: 'Security Verification',
      description: 'Automated security posture assessment including compliance certifications and vulnerability checks.',
      color: 'green' as const
    },
    {
      icon: Eye,
      title: 'Transparency Reports',
      description: 'Detailed reports on operational transparency, data handling, and governance practices.',
      color: 'green' as const
    },
    {
      icon: Scale,
      title: 'Compliance Mapping',
      description: 'Map trust signals to regulatory requirements including GDPR, SOC 2, and industry-specific standards.',
      color: 'green' as const
    }
  ];

  return (
    <section className="bg-gray-950 py-24 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5">
            <Shield size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Capabilities</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Trust Verification</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to verify and validate partner trustworthiness with evidence.
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