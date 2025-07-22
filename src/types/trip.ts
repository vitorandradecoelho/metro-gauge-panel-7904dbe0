export interface Trip {
  id: string;
  date: string;
  status: TripStatus;
  line: string;
  route: RouteDirection;
  execution: ExecutionStatus;
  plannedVehicle?: string;
  realVehicle?: string;
  tab?: number;
  passengers?: number;
  plannedStart?: string;
  realStart?: string;
  startDiff?: number;
  plannedEnd?: string;
  realEnd?: string;
  endDiff?: number;
  headway?: number;
  driver?: string;
  travelTime?: string;
  completion?: number;
  consortium: string;
}

export type TripStatus = 
  | 'VIAGEM PLANEJADA E REALIZADA'
  | 'EM ANDAMENTO'
  | 'NÃO INICIADA';

export type RouteDirection = 'ida' | 'volta';

export type ExecutionStatus = 'Fechada' | 'Aberta' | 'Não Iniciada';

export interface FilterOptions {
  line: string;
  route: string;
  consortium: string;
}

export interface ColumnVisibility {
  date: boolean;
  status: boolean;
  line: boolean;
  route: boolean;
  execution: boolean;
  plannedVehicle: boolean;
  realVehicle: boolean;
  tab: boolean;
  passengers: boolean;
  plannedStart: boolean;
  realStart: boolean;
  startDiff: boolean;
  plannedEnd: boolean;
  realEnd: boolean;
  endDiff: boolean;
  headway: boolean;
  driver: boolean;
  travelTime: boolean;
  completion: boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  field: keyof Trip | null;
  direction: SortDirection;
}

export type ColumnKey = keyof ColumnVisibility;

export interface ColumnOrder {
  order: ColumnKey[];
}

export const defaultColumnVisibility: ColumnVisibility = {
  date: true,
  status: true,
  line: true,
  route: true,
  execution: true,
  plannedVehicle: true,
  realVehicle: true,
  tab: false,
  passengers: true,
  plannedStart: true,
  realStart: true,
  startDiff: false,
  plannedEnd: true,
  realEnd: true,
  endDiff: false,
  headway: false,
  driver: false,
  travelTime: true,
  completion: true,
};

export const defaultColumnOrder: ColumnKey[] = [
  'date',
  'status', 
  'line',
  'route',
  'execution',
  'plannedVehicle',
  'realVehicle',
  'tab',
  'passengers',
  'plannedStart',
  'realStart',
  'startDiff',
  'plannedEnd',
  'realEnd',
  'endDiff',
  'headway',
  'driver',
  'travelTime',
  'completion'
];