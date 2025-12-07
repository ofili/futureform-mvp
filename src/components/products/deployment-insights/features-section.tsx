import { FeatureCard } from '@/components/products/shared/feature-card';
import { Activity, Globe, Bell, BarChart3, Wifi, Shield } from 'lucide-react';

export function DeploymentInsightsFeatures() {
    const features = [
        {
            icon: Activity,
            title: 'Real-Time Monitoring',
            description: 'Track deployment status and health metrics in real-time across all your integrations and partner systems.',
            color: 'blue' as const
        },
        {
            icon: Globe,
            title: 'Multi-Market Coverage',
            description: 'Monitor deployments across 35+ frontier markets with localized insights and regional context.',
            color: 'blue' as const
        },
        {
            icon: Bell,
            title: 'Intelligent Alerts',
            description: 'Configurable alert thresholds with smart notifications via email, Slack, or webhook integrations.',
            color: 'blue' as const
        },
        {
            icon: BarChart3,
            title: 'Performance Analytics',
            description: 'Deep-dive into deployment performance with historical trends, comparisons, and forecasting.',
            color: 'blue' as const
        },
        {
            icon: Wifi,
            title: 'Integration Health',
            description: 'Monitor API connectivity, data sync status, and integration reliability scores.',
            color: 'blue' as const
        },
        {
            icon: Shield,
            title: 'Compliance Tracking',
            description: 'Ensure deployments meet regulatory requirements with automated compliance monitoring.',
            color: 'blue' as const
        }
    ];

    return (
        <section className="bg-gray-950 py-24 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
                        <Activity size={14} className="text-blue-400" />
                        <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Capabilities</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">Complete Deployment Visibility</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Everything you need to monitor and optimize your deployments across frontier markets.
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
