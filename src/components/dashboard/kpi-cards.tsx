import { TrendingUp, FileText, Activity, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardsProps {
    avgTrustScore: number;
    totalProjects: number;
    activeAssessments: number;
    creditsRemaining: number;
}

export function KPICards({ avgTrustScore, totalProjects, activeAssessments, creditsRemaining }: KPICardsProps) {
    const cards = [
        {
            label: 'Avg Trust Score',
            value: `${avgTrustScore}%`,
            change: '+3%',
            changeType: 'positive' as const,
            icon: TrendingUp,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            accent: 'border-l-blue-500'
        },
        {
            label: 'Total Projects',
            value: totalProjects.toString(),
            subtitle: 'Assessment projects',
            icon: FileText,
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            accent: 'border-l-gray-400'
        },
        {
            label: 'Active Assessments',
            value: activeAssessments.toString(),
            subtitle: 'In progress',
            icon: Activity,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            accent: 'border-l-orange-500'
        },
        {
            label: 'Credits Remaining',
            value: creditsRemaining.toString(),
            change: creditsRemaining < 5 ? 'Low balance' : undefined,
            changeType: creditsRemaining < 5 ? 'negative' as const : undefined,
            icon: Coins,
            iconBg: creditsRemaining < 5 ? 'bg-red-100' : 'bg-green-100',
            iconColor: creditsRemaining < 5 ? 'text-red-600' : 'text-green-600',
            accent: creditsRemaining < 5 ? 'border-l-red-500' : 'border-l-green-500',
            action: creditsRemaining < 5 ? { label: 'Top up', href: '/dashboard/credits' } : undefined
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`bg-white rounded-xl border border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-all p-5`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{card.value}</p>

                                {/* Change indicator or subtitle */}
                                <div className="mt-2 flex items-center gap-2">
                                    {card.change && (
                                        <span className={`inline-flex items-center text-xs font-medium ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {card.changeType === 'positive' ? (
                                                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                                            )}
                                            {card.change}
                                        </span>
                                    )}
                                    {card.subtitle && !card.change && (
                                        <span className="text-xs text-gray-400">{card.subtitle}</span>
                                    )}
                                    {card.action && (
                                        <a
                                            href={card.action.href}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            {card.action.label} →
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Icon */}
                            <div className={`p-3 rounded-lg ${card.iconBg}`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
