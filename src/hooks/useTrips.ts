import { useState, useEffect, useCallback } from 'react';
import { Trip, TripStatus, FilterOptions, RouteDirection, ExecutionStatus } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

export interface UseTripsReturn {
  trips: Trip[];
  filteredTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  refreshTrips: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  activeStatus: TripStatus | 'all';
  setActiveStatus: (status: TripStatus | 'all') => void;
}

// API request payload
interface ApiRequestPayload {
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  empresas: any[];
  trajetos: any[];
  idCliente: number;
  ordenacao: string;
  timezone: string;
  inicioDiaOperacional: string;
}

// API response interface
interface ApiResponse {
  totalizadores: {
    planejadas: number;
    planejadasAteMomento: number;
    realizadasAteMomento: number;
    realizadasPlanejadas: number;
    emAndamento: number;
    canceladas: number;
    naoIniciadas: number;
    naoRealizadas: number;
    reforco: number;
    atrasada: number;
    passageiros: number;
    totalVelocidadeMediaRealizada: number;
    indiceExecucao: number[];
    indicePartida: number[];
  };
  viagens: ApiTrip[];
  falhas: any;
}

// API Trip structure
interface ApiTrip {
  idViagemExecutada: string;
  data: string;
  dataFim: string;
  dataFormatada: string;
  dataAbertura: string;
  dataFechamento: string;
  idVeiculo?: string;
  veiculoReal?: string;
  partidaReal?: string;
  chegadaReal?: string;
  velocidadeMedia?: number;
  duracao?: string;
  duracaoSeg?: number;
  percentualConclusao?: string;
  tipoViagem?: number;
  emExecucao?: boolean;
  excluido?: boolean;
  kmPlanejado?: number;
  idPlanejamento?: number;
  idLinha?: string;
  idTabela?: number;
  nmTabela?: string;
  idHorario?: number;
  idEmpresaPlanejada?: number;
  veiculoPlan?: string;
  partidaPlan?: string;
  chegadaPlan?: string;
  status?: number;
  diffPartida?: number;
  diffChegada?: number;
  qtdPassageiros?: number;
  headwayStr?: string;
  headway?: number;
  cdMotorista?: string;
  nmMotorista?: string;
  trajeto?: {
    id: string;
    nome: string;
    sentido: string;
    numeroLinha: string;
    endPoint: {
      id: string;
      nome: string;
    };
  };
  apresentacao?: {
    classeExecucaoViagem: string;
    classeExecucaoViagemToolTip: string;
    classeStatusViagem: string;
    classeAlerta: string;
    alertaProximo: boolean;
  };
}

// Maps API status to our Trip status
const mapApiStatusToTripStatus = (apiTrip: ApiTrip): TripStatus => {
  if (apiTrip.emExecucao) {
    return 'EM ANDAMENTO';
  } else if (apiTrip.status === 1) {
    return 'VIAGEM PLANEJADA E REALIZADA';
  } else {
    return 'NÃO INICIADA';
  }
};

// Maps API execution to our execution status
const mapApiExecutionToExecution = (apiTrip: ApiTrip): ExecutionStatus => {
  if (apiTrip.emExecucao) {
    return 'Aberta';
  } else if (apiTrip.status === 1) {
    return 'Fechada';
  } else {
    return 'Não Iniciada';
  }
};

// Function to map API trips to our Trip interface
const mapApiTripsToTrips = (apiTrips: ApiTrip[]): Trip[] => {
  return apiTrips.map(apiTrip => ({
    id: apiTrip.idViagemExecutada,
    date: apiTrip.dataFormatada,
    status: mapApiStatusToTripStatus(apiTrip),
    line: apiTrip.trajeto?.nome || '',
    route: apiTrip.trajeto?.sentido as RouteDirection || 'ida',
    execution: mapApiExecutionToExecution(apiTrip),
    plannedVehicle: apiTrip.veiculoPlan,
    realVehicle: apiTrip.veiculoReal,
    tab: apiTrip.nmTabela ? parseInt(apiTrip.nmTabela) : undefined,
    passengers: apiTrip.qtdPassageiros,
    plannedStart: apiTrip.partidaPlan,
    realStart: apiTrip.partidaReal,
    startDiff: apiTrip.diffPartida,
    plannedEnd: apiTrip.chegadaPlan,
    realEnd: apiTrip.chegadaReal,
    endDiff: apiTrip.diffChegada,
    headway: apiTrip.headway,
    driver: apiTrip.nmMotorista,
    travelTime: apiTrip.duracao,
    completion: apiTrip.percentualConclusao ? parseFloat(apiTrip.percentualConclusao) : undefined,
    consortium: 'ETUFOR', // This information is not available in the API response, using default
  }));
};

// Fetch trips from API or fallback to mock data
const fetchTripsFromAPI = async (): Promise<Trip[]> => {
  // Get zone from localStorage
  const zone = localStorage.getItem('zone') || '4';
  
  try {
    // Create the date for today in the required format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Create the API request payload
    const payload: ApiRequestPayload = {
      dataInicio: formattedDate,
      dataFim: formattedDate,
      horaInicio: "00:00:00",
      horaFim: "23:59:59",
      empresas: [],
      trajetos: [
        {
          sentido: "ida",
          kmTrajeto: 17.56,
          endPoint: {
            _id: "5e8d41183d03432f435abdb2",
            nome: "Terminal Taboao"
          },
          startPoint: {
            gps: {
              type: "Point",
              coordinates: [-46.5241231, -23.7237791]
            },
            gpsPolygon: {
              type: "Polygon",
              coordinates: [[
                [-46.52478754520417, -23.72332723313967],
                [-46.524025766837596, -23.72270836439463],
                [-46.52331233024598, -23.72366609988563],
                [-46.52408480644227, -23.724137565197452],
                [-46.52478754520417, -23.72332723313967]
              ]]
            },
            id_migracao: 134663,
            _id: "5e8d411a3d03432f435ac148"
          },
          nome: "01 - Esperança / Sentido Taboão",
          _id: "5e8e3bbf4be5542e43e539e9",
          nomeExibicao: "01 - Esperança / Sentido Taboão",
          numeroLinha: "01"
        },
        {
          sentido: "volta",
          kmTrajeto: 15.37,
          endPoint: {
            _id: "5e8d411a3d03432f435ac148",
            nome: "Terminal Esperanca"
          },
          startPoint: {
            gps: {
              type: "Point",
              coordinates: [-46.60833811887102, -23.66737035747717]
            },
            gpsPolygon: {
              type: "Polygon",
              coordinates: [[
                [-46.60619258880616, -23.66679292434423],
                [-46.60796284675599, -23.665643219775326],
                [-46.60886943340302, -23.666576741350987],
                [-46.609534621238716, -23.667441471178986],
                [-46.60951850060241, -23.667952445206865],
                [-46.60791993141175, -23.668846644949628],
                [-46.60711526870728, -23.668031056418503],
                [-46.60619258880616, -23.66679292434423]
              ]]
            },
            id_migracao: 136029,
            _id: "5e8d41183d03432f435abdb2"
          },
          nome: "01 - Taboão / Sentido Esperança",
          _id: "5e8e3bbf4be5542e43e539ea",
          nomeExibicao: "01 - Taboão / Sentido Esperança",
          numeroLinha: "01"
        }
      ],
      idCliente: 1307,
      ordenacao: "horario",
      timezone: "America/Fortaleza",
      inicioDiaOperacional: "00:00:00"
    };

    // Make the API call with proper headers
    console.log(`Making API call with zone: ${zone}`);
    
    // Real API integration
    const apiUrl = 'https://planejamento-viagem-api.sinopticoplus.com/planejamento-viagem-api/v1/dashboard/consultar';
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Zone': zone,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    return mapApiTripsToTrips(data.viagens);
  } catch (error) {
    console.error('Error fetching trips:', error);
    console.log('Falling back to mock data');
    return mockTrips;
  }
};

export const useTrips = (): UseTripsReturn => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    line: '',
    route: '',
    consortium: '',
  });
  const [activeStatus, setActiveStatus] = useState<TripStatus | 'all'>('all');

  const refreshTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTrips = await fetchTripsFromAPI();
      setTrips(fetchedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter trips based on current filters and active status
  const filteredTrips = trips.filter(trip => {
    // Status filter
    if (activeStatus !== 'all' && trip.status !== activeStatus) {
      return false;
    }

    // Line filter
    if (filters.line && trip.line !== filters.line) {
      return false;
    }

    // Route filter
    if (filters.route && trip.route !== filters.route) {
      return false;
    }

    // Consortium filter
    if (filters.consortium && trip.consortium !== filters.consortium) {
      return false;
    }

    return true;
  });

  // Initial load
  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTrips();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshTrips]);

  return {
    trips,
    filteredTrips,
    isLoading,
    error,
    refreshTrips,
    filters,
    setFilters,
    activeStatus,
    setActiveStatus,
  };
};