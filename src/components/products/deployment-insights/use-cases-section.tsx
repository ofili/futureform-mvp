import { CheckCircle, Rocket, RefreshCw, AlertTriangle, BarChart } from 'lucide-react';

export function DeploymentInsightsUseCases() {
    const useCases = [
        {
            icon: Rocket,
            title: 'Multi-Market Rollout',
            description: 'Track deployment progress across multiple markets simultaneously with unified dashboards.',
            benefits: ['Phased rollout tracking', 'Market-specific metrics', 'Rollback capabilities', 'Geo-distributed monitoring']
        },
        {
            icon: RefreshCw,
            title: 'Integration Health Monitoring',
            description: 'Monitor the health and performance of all your partner integrations in real-time.',
            benefits: ['API uptime tracking', 'Data sync verification', 'Latency monitoring', 'Error rate alerts', 'Throughput analysis']
        },
        {
            icon: BarChart,
            title: 'Performance Optimization',
            description: 'Identify bottlenecks and optimize deployment performance with actionable insights.',
            benefits: ['Performance benchmarking', 'Trend analysis', 'Automated recommendations']
        },
        {
            icon: AlertTriangle,
            title: 'Incident Response',
            description: 'Quickly identify and respond to deployment issues with intelligent alerting.',
            benefits: ['Smart alert routing', 'Issue prioritization', 'Root cause analysis', 'MTTR tracking', 'Post-incident reports', 'Runbook automation']
        }
    ];

    return (
        <section className="bg-midnight py-24 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Built for Your Operations</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        How operations teams use Deployment Insights to maintain visibility and control.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {useCases.map((useCase) => (
                        <div
                            key={useCase.title}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 hover:bg-gray-900/80 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <useCase.icon size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                                    <p className="text-gray-400">{useCase.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-6 pl-14">
                                {useCase.benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                                        <CheckCircle size={12} className="text-blue-400 flex-shrink-0" />
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
