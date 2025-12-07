import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'amber' | 'blue' | 'green' | 'purple' | 'cyan';
}

const colorMap = {
  amber: {
    border: 'hover:border-amber-500/30',
    icon: 'text-amber-400 group-hover:text-amber-300'
  },
  blue: {
    border: 'hover:border-blue-500/30',
    icon: 'text-blue-400 group-hover:text-blue-300'
  },
  green: {
    border: 'hover:border-green-500/30',
    icon: 'text-green-400 group-hover:text-green-300'
  },
  purple: {
    border: 'hover:border-purple-500/30',
    icon: 'text-purple-400 group-hover:text-purple-300'
  },
  cyan: {
    border: 'hover:border-cyan-500/30',
    icon: 'text-cyan-400 group-hover:text-cyan-300'
  }
};

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg p-8 ${styles.border} transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg`}
    >
      <Icon className={`${styles.icon} transition-colors mb-4`} size={32} />
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}