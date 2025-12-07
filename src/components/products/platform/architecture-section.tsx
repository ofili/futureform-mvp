export function PlatformArchitecture() {
  const layers = [
    {
      name: 'Data Ingestion Layer',
      description: 'Multi-source data collection from APIs, webhooks, and third-party integrations across 35+ markets.',
      features: ['Real-time ingestion', 'Data validation', 'Schema mapping']
    },
    {
      name: 'AI Processing Engine',
      description: 'Advanced machine learning models for trust scoring, anomaly detection, and predictive analytics.',
      features: ['Trust algorithms', 'ML models', 'Pattern recognition']
    },
    {
      name: 'Trust Framework',
      description: '6-layer trust assessment framework with sector-specific weights and veto criteria.',
      features: ['6 trust layers', 'Sector weights', 'Risk indicators']
    },
    {
      name: 'Data Orchestration',
      description: 'Unified data platform connecting all products and ensuring consistency across the ecosystem.',
      features: ['Data pipeline', 'Real-time sync', 'Cache optimization']
    }
  ];

  return (
    <section className="bg-gray-950 py-20 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Platform Architecture</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Layered architecture designed for scale, reliability, and performance
          </p>
        </div>

        <div className="space-y-8">
          {layers.map((layer, index) => (
            <div
              key={layer.name}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{layer.name}</h3>
                  <p className="text-gray-400 mb-4">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}