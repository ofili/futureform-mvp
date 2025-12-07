import { CheckCircle, Briefcase, Users, Building2, HeartHandshake } from 'lucide-react';

export function PartnerIntelligenceUseCases() {
  const useCases = [
    {
      icon: Briefcase,
      title: 'M&A Due Diligence',
      description: 'Assess acquisition targets across all trust dimensions before major investments.',
      benefits: ['Comprehensive risk analysis', 'Cultural fit evaluation', 'Integration planning', 'Hidden liability detection']
    },
    {
      icon: Users,
      title: 'Channel Partner Selection',
      description: 'Identify and qualify the best distribution partners for your products and services.',
      benefits: ['Performance benchmarking', 'Market coverage analysis', 'Growth potential scoring', 'Territory optimization', 'Partner tiering']
    },
    {
      icon: Building2,
      title: 'Vendor Management',
      description: 'Monitor and evaluate critical suppliers and service providers continuously.',
      benefits: ['Compliance tracking', 'Performance metrics', 'Risk alerts', 'Contract renewal insights']
    },
    {
      icon: HeartHandshake,
      title: 'Joint Venture Planning',
      description: 'Evaluate partners for strategic collaborations and shared investments.',
      benefits: ['Governance assessment', 'Ecosystem compatibility', 'Long-term viability', 'Resource alignment', 'Exit strategy planning']
    }
  ];

  return (
    <section className="bg-midnight py-24 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Built for Your Use Case</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            How leading organizations use Partner Intelligence across different functions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-amber-500/30 hover:bg-gray-900/80 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                  <useCase.icon size={24} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-gray-400">{useCase.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 pl-14">
                {useCase.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={12} className="text-amber-400 flex-shrink-0" />
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