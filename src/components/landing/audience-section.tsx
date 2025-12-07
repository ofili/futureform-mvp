import { Building2, Globe, Landmark, Briefcase, Users } from 'lucide-react';

export function AudienceSection() {
    const audiences = [
        {
            title: 'Investors',
            description: 'Reduce deal risk. Vet partners. Protect portfolio performance.',
            icon: Briefcase,
            color: 'amber'
        },
        {
            title: 'Governments',
            description: 'Strengthen procurement transparency. Select better contractors. Reduce corruption exposure.',
            icon: Landmark,
            color: 'blue'
        },
        {
            title: 'Development Finance',
            description: 'Deploy impact capital with accountability. Monitor project health. Maximize outcomes per dollar.',
            icon: Globe,
            color: 'green'
        },
        {
            title: 'Enterprises',
            description: 'Verify suppliers. Assess joint venture partners. Protect supply chain integrity.',
            icon: Building2,
            color: 'cyan'
        }
    ];

    const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
        amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'hover:border-amber-500/30' },
        blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'hover:border-blue-500/30' },
        green: { bg: 'bg-green-500/10', icon: 'text-green-400', border: 'hover:border-green-500/30' },
        cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-400', border: 'hover:border-cyan-500/30' }
    };

    return (
        <section className="py-24 bg-gray-950 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5">
                        <Users size={14} className="text-cyan-300" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">Who We Serve</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Built for Capital Deployers
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Organizations deploying capital in complex, high-stakes environments.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {audiences.map((audience, index) => {
                        const colors = colorMap[audience.color];
                        const Icon = audience.icon;
                        return (
                            <div key={index} className={`bg-gray-900/50 rounded-xl p-6 border border-gray-800 ${colors.border} transition-all duration-300 hover:bg-gray-900/80 group`}>
                                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} className={colors.icon} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{audience.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {audience.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
