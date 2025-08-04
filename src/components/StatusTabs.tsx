import { useTranslation } from 'react-i18next';
import { TripStatus } from '@/types/trip';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Play, BarChart3 } from 'lucide-react';

interface StatusTabsProps {
  activeStatus: TripStatus | 'all';
  onStatusChange: (status: TripStatus | 'all') => void;
  statusCounts: Record<TripStatus | 'all', number>;
}

const statusConfig = {
  all: { icon: BarChart3, key: 'all' },
  'VIAGEM PLANEJADA E REALIZADA': { icon: CheckCircle, key: 'completed' },
  'EM ANDAMENTO': { icon: Play, key: 'inProgress' },
  'NÃO INICIADA': { icon: Clock, key: 'notStarted' },
} as const;

export const StatusTabs = ({ activeStatus, onStatusChange, statusCounts }: StatusTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card border-b">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusKey = status as TripStatus | 'all';
        const isActive = activeStatus === statusKey;
        const count = statusCounts[statusKey] || 0;
        const Icon = config.icon;

        return (
          <button
            key={status}
            onClick={() => onStatusChange(statusKey)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "border border-transparent hover:bg-accent/50",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{t(config.key)}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};