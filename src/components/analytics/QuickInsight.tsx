'use client';

import { LightbulbIcon, TrendingUp, Info, AlertCircle } from 'lucide-react';

interface Props {
  type?: 'insight' | 'trend' | 'info' | 'warning';
  children: React.ReactNode;
}

export default function QuickInsight({ type = 'insight', children }: Props) {
  const configs = {
    insight: {
      icon: LightbulbIcon,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900'
    },
    trend: {
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg ${config.iconBg} p-2 mt-0.5`}>
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
