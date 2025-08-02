import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip, ColumnVisibility, SortConfig, SortDirection, ColumnKey } from '@/types/trip';
import { StatusIcon } from './StatusIcon';
import { TripModal } from './TripModal';
import { TripRegistrationModal } from './TripRegistrationModal';
import { TripObservationModal } from './TripObservationModal';
import { TripDeleteModal } from './TripDeleteModal';
import { EditScheduleModal } from './EditScheduleModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Eye, MoreVertical, Smartphone, Monitor, ChevronUp, ChevronDown, ChevronsUpDown, GripVertical, Edit, Delete, Copy, MessageSquare, Clock } from 'lucide-react';
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
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

  const handleActionClick = (trip: Trip, action: string) => {
    setSelectedTrip(trip);
    
    switch (action) {
      case 'view':
        setModalOpen(true);
        break;
      case 'edit':
        // Abrir modal de cadastro/edição de viagem
        setEditModalOpen(true);
        break;
      case 'observation':
        setObservationModalOpen(true);
        break;
      case 'editSchedule':
        setEditScheduleModalOpen(true);
        break;
      case 'duplicate':
        // TODO: Implementar duplicação
        console.log('Duplicar viagem:', trip);
        break;
      case 'delete':
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
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
    // Mobile Table Layout with configurable columns
    const mobileColumns: ColumnKey[] = ['status', 'line', 'route', 'date', 'completion'];
    const visibleMobileColumns = mobileColumns.filter(col => columnVisibility[col]);
    
    return (
      <>
        <div className="w-full overflow-auto p-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {visibleMobileColumns.map((columnKey) => (
                  <th key={columnKey} className="p-2 text-left font-medium">
                    {t(columnKey)}
                  </th>
                ))}
                <th className="p-2 text-left font-medium">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-muted/50 transition-colors">
                  {visibleMobileColumns.map((columnKey) => {
                    const renderCell = () => {
                      switch (columnKey) {
                        case 'status':
                          return (
                            <div className="flex items-center">
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
                        case 'date':
                          return trip.date;
                        case 'completion':
                          return formatPercentage(trip.completion);
                        default:
                          return '-';
                      }
                    };

                    return (
                      <td key={columnKey} className="p-2">
                        {renderCell()}
                      </td>
                    );
                  })}
                  <td className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-6 w-6"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'view')}>
                          <Eye className="h-3 w-3 mr-2" />
                          {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'edit')}>
                          <Edit className="h-3 w-3 mr-2" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'observation')}>
                          <MessageSquare className="h-3 w-3 mr-2" />
                          Incluir Observação
                        </DropdownMenuItem>
                        {trip.status === 'NÃO INICIADA' && (
                          <DropdownMenuItem onClick={() => handleActionClick(trip, 'editSchedule')}>
                            <Clock className="h-3 w-3 mr-2" />
                            Editar Horário
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'duplicate')}>
                          <Copy className="h-3 w-3 mr-2" />
                          {t('duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleActionClick(trip, 'delete')}
                          className="text-destructive focus:text-destructive"
                        >
                          <Delete className="h-3 w-3 mr-2" />
                          Excluir Viagem
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      
      <TripRegistrationModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        trip={selectedTrip}
      />
      
      <TripObservationModal 
        isOpen={observationModalOpen} 
        onClose={() => setObservationModalOpen(false)}
        trip={selectedTrip}
      />
      
      <TripDeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        trip={selectedTrip}
      />
      
      <EditScheduleModal 
        isOpen={editScheduleModalOpen} 
        onClose={() => setEditScheduleModalOpen(false)}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'view')}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'edit')}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'observation')}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Incluir Observação
                        </DropdownMenuItem>
                        {trip.status === 'NÃO INICIADA' && (
                          <DropdownMenuItem onClick={() => handleActionClick(trip, 'editSchedule')}>
                            <Clock className="h-4 w-4 mr-2" />
                            Editar Horário
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleActionClick(trip, 'duplicate')}>
                          <Copy className="h-4 w-4 mr-2" />
                          {t('duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleActionClick(trip, 'delete')}
                          className="text-destructive focus:text-destructive"
                        >
                          <Delete className="h-4 w-4 mr-2" />
                          Excluir Viagem
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
        
        <TripRegistrationModal 
          isOpen={editModalOpen} 
          onClose={() => setEditModalOpen(false)}
          trip={selectedTrip}
        />
        
        <TripObservationModal 
          isOpen={observationModalOpen} 
          onClose={() => setObservationModalOpen(false)}
          trip={selectedTrip}
        />
        
        <TripDeleteModal 
          isOpen={deleteModalOpen} 
          onClose={() => setDeleteModalOpen(false)}
          trip={selectedTrip}
        />
        
        <EditScheduleModal 
          isOpen={editScheduleModalOpen} 
          onClose={() => setEditScheduleModalOpen(false)}
        />
      </>
    );
};