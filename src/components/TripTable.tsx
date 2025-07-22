import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip, ColumnVisibility, SortConfig, SortDirection } from '@/types/trip';
import { StatusIcon } from './StatusIcon';
import { TripModal } from './TripModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, MoreVertical, Smartphone, Monitor, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripTableProps {
  trips: Trip[];
  columnVisibility: ColumnVisibility;
}

export const TripTable = ({ trips, columnVisibility }: TripTableProps) => {
  const { t } = useTranslation();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: null });
  const isMobile = useIsMobile();

  const handleActionClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleSort = (field: keyof Trip) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.field === field) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }
    
    setSortConfig({ field: direction ? field : null, direction });
  };

  const sortedTrips = useMemo(() => {
    if (!sortConfig.field || !sortConfig.direction) {
      return trips;
    }

    return [...trips].sort((a, b) => {
      const aValue = a[sortConfig.field!];
      const bValue = b[sortConfig.field!];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? result : -result;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const result = aValue - bValue;
        return sortConfig.direction === 'asc' ? result : -result;
      }
      
      // Fallback to string comparison
      const result = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [trips, sortConfig]);

  const getSortIcon = (field: keyof Trip) => {
    if (sortConfig.field !== field) {
      return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="h-4 w-4" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="h-4 w-4" />;
    }
    
    return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
  };

  const SortableHeader = ({ field, children }: { field: keyof Trip; children: React.ReactNode }) => (
    <th className="p-3 text-left font-medium">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium text-foreground hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        <span className="flex items-center gap-1">
          {children}
          {getSortIcon(field)}
        </span>
      </Button>
    </th>
  );

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
    // Mobile Table Layout with simplified columns
    return (
      <>
        <div className="w-full overflow-auto p-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <SortableHeader field="status">{t('status')}</SortableHeader>
                <SortableHeader field="line">{t('line')}</SortableHeader>
                <SortableHeader field="route">{t('route')}</SortableHeader>
                <SortableHeader field="date">{t('date')}</SortableHeader>
                <SortableHeader field="completion">{t('completion')}</SortableHeader>
                <th className="p-2 text-left font-medium">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-2">
                    <div className="flex items-center">
                      <StatusIcon status={trip.status} />
                    </div>
                  </td>
                  <td className="p-2 font-medium">
                    {trip.line.substring(0, 5)}...
                  </td>
                  <td className="p-2">
                    <Badge variant="outline" className="text-xs">
                      {t(trip.route)}
                    </Badge>
                  </td>
                  <td className="p-2">{trip.date}</td>
                  <td className="p-2">{formatPercentage(trip.completion)}</td>
                  <td className="p-2">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleActionClick(trip)}
                      className="h-6 w-6"
                    >
                      <Eye className="h-3 w-3" />
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
  }

  // Desktop Table Layout
  return (
    <>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columnVisibility.date && (
                <SortableHeader field="date">{t('date')}</SortableHeader>
              )}
              {columnVisibility.status && (
                <SortableHeader field="status">{t('status')}</SortableHeader>
              )}
              {columnVisibility.line && (
                <SortableHeader field="line">{t('line')}</SortableHeader>
              )}
              {columnVisibility.route && (
                <SortableHeader field="route">{t('route')}</SortableHeader>
              )}
              {columnVisibility.execution && (
                <SortableHeader field="execution">{t('execution')}</SortableHeader>
              )}
              {columnVisibility.plannedVehicle && (
                <SortableHeader field="plannedVehicle">{t('plannedVehicle')}</SortableHeader>
              )}
              {columnVisibility.realVehicle && (
                <SortableHeader field="realVehicle">{t('realVehicle')}</SortableHeader>
              )}
              {columnVisibility.tab && (
                <SortableHeader field="tab">{t('tab')}</SortableHeader>
              )}
              {columnVisibility.passengers && (
                <SortableHeader field="passengers">{t('passengers')}</SortableHeader>
              )}
              {columnVisibility.plannedStart && (
                <SortableHeader field="plannedStart">{t('plannedStart')}</SortableHeader>
              )}
              {columnVisibility.realStart && (
                <SortableHeader field="realStart">{t('realStart')}</SortableHeader>
              )}
              {columnVisibility.startDiff && (
                <SortableHeader field="startDiff">{t('startDiff')}</SortableHeader>
              )}
              {columnVisibility.plannedEnd && (
                <SortableHeader field="plannedEnd">{t('plannedEnd')}</SortableHeader>
              )}
              {columnVisibility.realEnd && (
                <SortableHeader field="realEnd">{t('realEnd')}</SortableHeader>
              )}
              {columnVisibility.endDiff && (
                <SortableHeader field="endDiff">{t('endDiff')}</SortableHeader>
              )}
              {columnVisibility.headway && (
                <SortableHeader field="headway">{t('headway')}</SortableHeader>
              )}
              {columnVisibility.driver && (
                <SortableHeader field="driver">{t('driver')}</SortableHeader>
              )}
              {columnVisibility.travelTime && (
                <SortableHeader field="travelTime">{t('travelTime')}</SortableHeader>
              )}
              {columnVisibility.completion && (
                <SortableHeader field="completion">{t('completion')}</SortableHeader>
              )}
              <th className="p-3 text-left font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrips.map((trip) => (
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