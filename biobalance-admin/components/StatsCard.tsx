import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all hover:border-emerald-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-700" />
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-slate-500 font-medium">{description}</p>
      )}
      
      {trend && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100">
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-500 font-medium">מהשבוע שעבר</span>
        </div>
      )}
    </div>
  );
}

