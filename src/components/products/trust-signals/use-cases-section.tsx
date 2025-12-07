import { CheckCircle, Shield, FileCheck, Eye, Scale } from 'lucide-react';

export function TrustSignalsUseCases() {
  const useCases = [
    {
      icon: Shield,
      title: 'Investment Due Diligence',
      description: 'Validate partner credentials and track records before committing capital.',
      benefits: ['Background verification', 'Financial health checks', 'Reference validation', 'Red flag detection']
    },
    {
      icon: FileCheck,
      title: 'Compliance Verification',
      description: 'Ensure partners meet regulatory requirements and industry standards.',
      benefits: ['Certification tracking', 'Audit trail management', 'Policy compliance', 'Regulatory mapping']
    },
    {
      icon: Eye,
      title: 'Continuous Monitoring',
      description: 'Track trust signals over time to detect changes in partner reliability.',
      benefits: ['Real-time alerts', 'Trend analysis', 'Risk scoring', 'Automated reporting']
    },
    {
      icon: Scale,
      title: 'Governance Assessment',
      description: 'Evaluate organizational governance structures and decision-making processes.',
      benefits: ['Board composition', 'Conflict of interest checks', 'Transparency scoring', 'Stakeholder mapping']
    }
  ];

  return (
    <section className="bg-midnight py-24 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Built for Your Use Case</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            How organizations use Trust Signals to make better partnership decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-green-500/30 hover:bg-gray-900/80 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <useCase.icon size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-gray-400">{useCase.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 pl-14">
                {useCase.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-xs">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
