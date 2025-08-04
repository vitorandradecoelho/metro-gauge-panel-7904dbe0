import { CheckCircle, Clock, Play, XCircle } from 'lucide-react';
import { TripStatus } from '@/types/trip';
import { cn } from '@/lib/utils';

interface StatusIconProps {
  status: TripStatus;
  className?: string;
   colorClass?: string;
}

export const StatusIcon = ({ status, className, colorClass }: StatusIconProps) => {
  const getIcon = () => {
    switch (status) {
      case 'VIAGEM PLANEJADA E REALIZADA':
        return <CheckCircle className={cn("h-4 w-4",colorClass ?? "text-green-600", className)} />;
      case 'EM ANDAMENTO':
        return <Play className={cn("h-4 w-4",colorClass ?? "textColorBlue", className)} />;
      case 'NÃO INICIADA':
        return <Clock className={cn("h-4 w-4",colorClass ?? " text-gray-600", className)} />;
      default:
        return <XCircle className={cn("h-4 w-4",colorClass ?? "text-red-600", className)} />;
    }
  };

  return getIcon();
};