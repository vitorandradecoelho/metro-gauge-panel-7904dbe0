import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip, ColumnVisibility, SortConfig, SortDirection, ColumnKey } from '@/types/trip';
import { StatusIcon } from './StatusIcon';
import { TripModal } from './TripModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, MoreVertical, Smartphone, Monitor, ChevronUp, ChevronDown, ChevronsUpDown, GripVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TripTableProps {
  trips: Trip[];
  columnVisibility: ColumnVisibility;
  columnOrder: ColumnKey[];
  onColumnOrderChange: (order: ColumnKey[]) => void;
}

export const TripTable = ({ trips, columnVisibility, columnOrder, onColumnOrderChange }: TripTableProps) => {
  const { t } = useTranslation();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: null });
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columnOrder.indexOf(active.id as ColumnKey);
      const newIndex = columnOrder.indexOf(over?.id as ColumnKey);
      
      onColumnOrderChange(arrayMove(columnOrder, oldIndex, newIndex));
    }
  };

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

  const DraggableHeader = ({ field, children }: { field: ColumnKey; children: React.ReactNode }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: field });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    if (!columnVisibility[field]) return null;

    return (
      <th 
        ref={setNodeRef} 
        style={style} 
        className={cn(
          "p-3 text-left font-medium bg-muted/50 relative",
          isDragging && "z-50 opacity-50"
        )}
        {...attributes}
      >
        <div className="flex items-center gap-2">
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing flex items-center gap-1 opacity-50 hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 font-medium text-foreground hover:bg-transparent flex-1 justify-start"
            onClick={() => handleSort(field as keyof Trip)}
          >
            <span className="flex items-center gap-1">
              {children}
              {getSortIcon(field as keyof Trip)}
            </span>
          </Button>
        </div>
      </th>
    );
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
    // Mobile Table Layout with simplified columns
    return (
      <>
        <div className="w-full overflow-auto p-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left font-medium">{t('status')}</th>
                <th className="p-2 text-left font-medium">{t('line')}</th>
                <th className="p-2 text-left font-medium">{t('route')}</th>
                <th className="p-2 text-left font-medium">{t('date')}</th>
                <th className="p-2 text-left font-medium">{t('completion')}</th>
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                <tr className="border-b bg-muted/50">
                  {columnOrder.map((columnKey) => (
                    <DraggableHeader key={columnKey} field={columnKey}>
                      {t(columnKey)}
                    </DraggableHeader>
                  ))}
                  <th className="p-3 text-left font-medium bg-muted/50">{t('actions')}</th>
                </tr>
              </SortableContext>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-muted/50 transition-colors">
                  {columnOrder.map((columnKey) => {
                    if (!columnVisibility[columnKey]) return null;
                    
                    const renderCell = () => {
                      switch (columnKey) {
                        case 'date':
                          return trip.date;
                        case 'status':
                          return (
                            <div className="flex items-center gap-2">
                              <StatusIcon status={trip.status} />
                            </div>
                          );
                        case 'line':
                          return <span className="font-medium">{trip.line.substring(0, 5)}...</span>;
                        case 'route':
                          return (
                            <Badge variant="outline" className="text-xs">
                              {t(trip.route)}
                            </Badge>
                          );
                        case 'execution':
                          return t(trip.execution);
                        case 'plannedVehicle':
                          return trip.plannedVehicle || '-';
                        case 'realVehicle':
                          return trip.realVehicle || '-';
                        case 'tab':
                          return trip.tab || '-';
                        case 'passengers':
                          return trip.passengers || '-';
                        case 'plannedStart':
                          return formatTime(trip.plannedStart);
                        case 'realStart':
                          return formatTime(trip.realStart);
                        case 'startDiff':
                          return trip.startDiff ?? '-';
                        case 'plannedEnd':
                          return formatTime(trip.plannedEnd);
                        case 'realEnd':
                          return formatTime(trip.realEnd);
                        case 'endDiff':
                          return trip.endDiff ?? '-';
                        case 'headway':
                          return trip.headway ?? '-';
                        case 'driver':
                          return trip.driver || '-';
                        case 'travelTime':
                          return trip.travelTime || '-';
                        case 'completion':
                          return formatPercentage(trip.completion);
                        default:
                          return '-';
                      }
                    };

                    return (
                      <td key={columnKey} className="p-3">
                        {renderCell()}
                      </td>
                    );
                  })}
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
      </DndContext>
      
      <TripModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};