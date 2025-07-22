import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip, ColumnVisibility } from '@/types/trip';
import { StatusIcon } from './StatusIcon';
import { TripModal } from './TripModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, MoreVertical, Smartphone, Monitor } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripTableProps {
  trips: Trip[];
  columnVisibility: ColumnVisibility;
}

export const TripTable = ({ trips, columnVisibility }: TripTableProps) => {
  const { t } = useTranslation();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleActionClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    return time;
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(1)}%`;
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'VIAGEM PLANEJADA E REALIZADA':
        return 'status-completed';
      case 'EM ANDAMENTO':
        return 'status-in-progress';
      case 'NÃO INICIADA':
        return 'status-not-started';
      default:
        return 'status-not-started';
    }
  };

  if (isMobile) {
    // Mobile Card Layout
    return (
      <>
        <div className="space-y-3 p-4">
          {trips.map((trip) => (
            <Card key={trip.id} className="p-4 space-y-3 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={trip.status} />
                  <Badge className={cn("text-xs", getStatusClassName(trip.status))}>
                    {t(trip.status)}
                  </Badge>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleActionClick(trip)}
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-sm">
                  {trip.line.substring(0, 5)}...
                </div>
                <div className="text-xs text-muted-foreground">
                  {t(trip.route)} • {trip.date}
                </div>
                
                {trip.passengers !== undefined && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">{t('passengers')}: </span>
                    <span className="font-medium">{trip.passengers}</span>
                  </div>
                )}
                
                {trip.plannedStart && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('plannedStart')}:</span>
                    <span>{formatTime(trip.plannedStart)}</span>
                  </div>
                )}
                
                {trip.completion !== undefined && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('completion')}:</span>
                    <span className="font-medium">{formatPercentage(trip.completion)}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <TripModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
        />
      </>
    );
  }

  // Desktop Table Layout
  return (
    <>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columnVisibility.date && (
                <th className="p-3 text-left font-medium">{t('date')}</th>
              )}
              {columnVisibility.status && (
                <th className="p-3 text-left font-medium">{t('status')}</th>
              )}
              {columnVisibility.line && (
                <th className="p-3 text-left font-medium">{t('line')}</th>
              )}
              {columnVisibility.route && (
                <th className="p-3 text-left font-medium">{t('route')}</th>
              )}
              {columnVisibility.execution && (
                <th className="p-3 text-left font-medium">{t('execution')}</th>
              )}
              {columnVisibility.plannedVehicle && (
                <th className="p-3 text-left font-medium">{t('plannedVehicle')}</th>
              )}
              {columnVisibility.realVehicle && (
                <th className="p-3 text-left font-medium">{t('realVehicle')}</th>
              )}
              {columnVisibility.tab && (
                <th className="p-3 text-left font-medium">{t('tab')}</th>
              )}
              {columnVisibility.passengers && (
                <th className="p-3 text-left font-medium">{t('passengers')}</th>
              )}
              {columnVisibility.plannedStart && (
                <th className="p-3 text-left font-medium">{t('plannedStart')}</th>
              )}
              {columnVisibility.realStart && (
                <th className="p-3 text-left font-medium">{t('realStart')}</th>
              )}
              {columnVisibility.startDiff && (
                <th className="p-3 text-left font-medium">{t('startDiff')}</th>
              )}
              {columnVisibility.plannedEnd && (
                <th className="p-3 text-left font-medium">{t('plannedEnd')}</th>
              )}
              {columnVisibility.realEnd && (
                <th className="p-3 text-left font-medium">{t('realEnd')}</th>
              )}
              {columnVisibility.endDiff && (
                <th className="p-3 text-left font-medium">{t('endDiff')}</th>
              )}
              {columnVisibility.headway && (
                <th className="p-3 text-left font-medium">{t('headway')}</th>
              )}
              {columnVisibility.driver && (
                <th className="p-3 text-left font-medium">{t('driver')}</th>
              )}
              {columnVisibility.travelTime && (
                <th className="p-3 text-left font-medium">{t('travelTime')}</th>
              )}
              {columnVisibility.completion && (
                <th className="p-3 text-left font-medium">{t('completion')}</th>
              )}
              <th className="p-3 text-left font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-b hover:bg-muted/50 transition-colors">
                {columnVisibility.date && (
                  <td className="p-3">{trip.date}</td>
                )}
                {columnVisibility.status && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={trip.status} />
                    </div>
                  </td>
                )}
                {columnVisibility.line && (
                  <td className="p-3 font-medium">
                    {trip.line.substring(0, 5)}...
                  </td>
                )}
                {columnVisibility.route && (
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {t(trip.route)}
                    </Badge>
                  </td>
                )}
                {columnVisibility.execution && (
                  <td className="p-3">{t(trip.execution)}</td>
                )}
                {columnVisibility.plannedVehicle && (
                  <td className="p-3">{trip.plannedVehicle || '-'}</td>
                )}
                {columnVisibility.realVehicle && (
                  <td className="p-3">{trip.realVehicle || '-'}</td>
                )}
                {columnVisibility.tab && (
                  <td className="p-3">{trip.tab || '-'}</td>
                )}
                {columnVisibility.passengers && (
                  <td className="p-3">{trip.passengers || '-'}</td>
                )}
                {columnVisibility.plannedStart && (
                  <td className="p-3">{formatTime(trip.plannedStart)}</td>
                )}
                {columnVisibility.realStart && (
                  <td className="p-3">{formatTime(trip.realStart)}</td>
                )}
                {columnVisibility.startDiff && (
                  <td className="p-3">{trip.startDiff ?? '-'}</td>
                )}
                {columnVisibility.plannedEnd && (
                  <td className="p-3">{formatTime(trip.plannedEnd)}</td>
                )}
                {columnVisibility.realEnd && (
                  <td className="p-3">{formatTime(trip.realEnd)}</td>
                )}
                {columnVisibility.endDiff && (
                  <td className="p-3">{trip.endDiff ?? '-'}</td>
                )}
                {columnVisibility.headway && (
                  <td className="p-3">{trip.headway ?? '-'}</td>
                )}
                {columnVisibility.driver && (
                  <td className="p-3">{trip.driver || '-'}</td>
                )}
                {columnVisibility.travelTime && (
                  <td className="p-3">{trip.travelTime || '-'}</td>
                )}
                {columnVisibility.completion && (
                  <td className="p-3">{formatPercentage(trip.completion)}</td>
                )}
                <td className="p-3">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleActionClick(trip)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <TripModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};