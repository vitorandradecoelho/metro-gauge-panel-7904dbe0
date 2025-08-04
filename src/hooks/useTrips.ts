import { useState, useEffect, useCallback } from "react";
import { Trip, TripStatus, FilterOptions, ExecutionStatus } from "@/types/trip";
import { mockTrips } from "@/data/mockData";
import { ApiPrefix } from "@/constants/m2mconfig";
import api from "@/services/api";
import { getClienteLocalStorage } from "@/services/localStorage";
import { ILinha, ITrajeto } from "@/types/line";
import { IConsortiums } from "@/types/consortiums";
import { t } from "i18next";
import { useToast } from "@/hooks/use-toast";
import { isAfter, subHours } from "date-fns";

export interface UseTripsReturn {
  trips: Trip[];
  filteredTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  refreshTrips: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  activeStatus: TripStatus | "all";
  setActiveStatus: (status: TripStatus | "all") => void;
  lines: ILinha[];
  consortiums: IConsortiums[];
  routes: ITrajeto[];
  setRoutes: (trajetos: any[]) => void;
  consultTrips: () => void;
  hasSearched: boolean;
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
    return "EM ANDAMENTO";
  } else if (apiTrip.status === 1) {
    return "VIAGEM PLANEJADA E REALIZADA";
  } else {
    return "NÃO INICIADA";
  }
};

// Maps API execution to our execution status
const mapApiExecutionToExecution = (apiTrip: ApiTrip): ExecutionStatus => {
  if (apiTrip.emExecucao) {
    return "Aberta";
  } else if (apiTrip.status === 1) {
    return "Fechada";
  } else {
    return "Não Iniciada";
  }
};

// Function to map API trips to our Trip interface
const mapApiTripsToTrips = (apiTrips: ApiTrip[]): Trip[] => {
  return apiTrips.map((apiTrip) => ({
    id: apiTrip.idViagemExecutada,
    scheduleId: apiTrip.idHorario,
    date: apiTrip.dataFormatada,
    status: mapApiStatusToTripStatus(apiTrip),
    line: apiTrip.trajeto?.nome || "",
    lineNumber: apiTrip.trajeto.numeroLinha,
    route: apiTrip.trajeto?.endPoint.nome,
    execution: mapApiExecutionToExecution(apiTrip),
    plannedId: apiTrip.idPlanejamento,
    plannedVehicle: apiTrip.veiculoPlan,
    realVehicle: apiTrip.veiculoReal,
    tabId: apiTrip.idTabela,
    tab: apiTrip.nmTabela,
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
    completion: apiTrip.percentualConclusao
      ? parseFloat(apiTrip.percentualConclusao)
      : undefined,
    consortium: "ETUFOR", // This information is not available in the API response, using default
    rawRoute: apiTrip.trajeto,
  }));
};

export const useTrips = (): UseTripsReturn => {
  const clienteLocalStorage = getClienteLocalStorage();
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    line: "",
    route: "",
    consortium: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "00:00",
    endDate: new Date().toISOString().split("T")[0],
    endTime: "23:59",
    realTimeEnabled: false,
    realTimeMinutes: 30,
  });
  const [activeStatus, setActiveStatus] = useState<TripStatus | "all">("all");
  const [lines, setLines] = useState<ILinha[]>([]);
  const [routes, setRoutes] = useState<ITrajeto[]>([]);
  const [consortiums, setConsortiums] = useState<IConsortiums[]>([]);

  // Função para buscar trajetos baseado nos filtros
  const getFilteredRoutes = useCallback(() => {
    // Busca a linha selecionada e retorna seus trajetos
    const selectedLine = lines.find((line) => line._id === filters.line);
    if (selectedLine && selectedLine.trajetos) {
      // Se uma rota específica foi selecionada, filtra apenas ela
      if (filters.route) {
        return selectedLine.trajetos.filter(
          (trajeto) => trajeto.sentido === filters.route
        );
      }
      // Caso contrário, retorna todos os trajetos da linha
      return selectedLine.trajetos;
    }

    return routes; // Fallback para os trajetos já carregados
  }, [filters.line, filters.route, lines, routes]);

  // Função para buscar empresas baseado no consórcio selecionado
  const getFilteredRoutesByConsortium = useCallback(() => {
    if (!filters.consortium) {
      return []; // Se nenhum consórcio for selecionado, não filtra por empresa
    }

    const unicos = new Map<string, any>();

    const add = (trajetos: any[]) => {
      trajetos.forEach((t) => {
        if (!unicos.has(t._id)) unicos.set(t._id, { ...t });
      });
    };

    const selectedConsortium = consortiums.find(
      (c) => c.consorcio === filters.consortium
    );
    if (selectedConsortium) {
      lines.forEach((l) => {
        const pertence =
          l.consorcios?.some(
            (c) => c.consorcioId === selectedConsortium.consorcioId
          ) || l.consorcio?.consorcioId === selectedConsortium.consorcioId;
        if (pertence) add(l.trajetos);
      });

      return Array.from(unicos.values()).map((t) => {
        const { wayPoints, ...rest } = t;
        return rest;
      });
    }

    return [];
  }, [filters.consortium, consortiums]);

  // Fetch trips from API com filtros aplicados
  const fetchTripsFromAPI = useCallback(async (): Promise<Trip[]> => {
    try {
      const cliente = getClienteLocalStorage();

      // Determina as datas baseado no filtro de tempo real
      let startDate: string;
      let endDate: string;
      let startTime: string;
      let endTime: string;

      if (filters.realTimeEnabled) {
        // Para tempo real, usa a data atual e calcula o intervalo baseado nos minutos
        const now = new Date();
        const cutoffTime = new Date(
          now.getTime() - filters.realTimeMinutes * 60 * 1000
        );

        startDate = cutoffTime.toISOString().split("T")[0];
        endDate = now.toISOString().split("T")[0];
        startTime = cutoffTime.toTimeString().split(" ")[0];
        endTime = now.toTimeString().split(" ")[0];
      } else {
        // Usa os filtros manuais de data/hora
        startDate = filters.startDate;
        endDate = filters.endDate;
        startTime = filters.startTime + ":00"; // Adiciona segundos
        endTime = filters.endTime + ":59"; // Adiciona segundos para incluir todo o minuto
      }

      let filteredRoutes: any[] = [];
      if (filters.consortium) {
        filteredRoutes = getFilteredRoutesByConsortium();
      } else {
        filteredRoutes = getFilteredRoutes();
      }

      // Create the API request payload
      const payload: ApiRequestPayload = {
        dataInicio: startDate,
        dataFim: endDate,
        horaInicio: startTime,
        horaFim: endTime,
        empresas: cliente.empresas,
        trajetos: filteredRoutes,
        idCliente: cliente.idCliente || 1307,
        ordenacao: "horario",
        timezone: cliente.gmtCliente || "America/Fortaleza",
        inicioDiaOperacional: cliente.inicioDiaOperacional || "00:00:00",
      };

      const response = await api.put<any>(
        `${ApiPrefix.VIAGEM_PLANEJAMENTO_API}/v1/dashboard/consultar`,
        payload
      );
      const data: ApiResponse = response.data;
      return mapApiTripsToTrips(data.viagens);
    } catch (error) {
      console.error("Error fetching trips:", error);
      console.log("Falling back to mock data");
      return mockTrips;
    }
  }, [filters, getFilteredRoutes, getFilteredRoutesByConsortium]);

  const verifyDiffDate = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ) => {
    const dtIni = new Date(`${startDate}:${startTime}`);
    const dtFim = new Date(`${endDate}:${endTime}`);

    return isAfter(subHours(dtFim, 24), dtIni);
  };

  const refreshTrips = useCallback(async () => {
    if (!filters.line && !filters.consortium) {
      toast({ title: t("Selecione uma Linha ou Agrupamento") });
      return;
    }

    if (!filters.realTimeEnabled) {
      if (
        verifyDiffDate(
          filters.startDate,
          filters.startTime,
          filters.endDate,
          filters.endTime
        )
      ) {
        toast({ title: t("rangeMaiorQuePermitido") });
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const fetchedTrips = await fetchTripsFromAPI();
      setTrips(fetchedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trips");
    } finally {
      setIsLoading(false);
    }
  }, [fetchTripsFromAPI]);

  // Nova função para consultar trips com base nos filtros atuais
  const consultTrips = useCallback(() => {
    refreshTrips();
  }, [refreshTrips]);

  // Filter trips based on current filters and active status
  const filteredTrips = trips.filter((trip) => {
    // Status filter
    if (activeStatus !== "all" && trip.status !== activeStatus) {
      return false;
    }

    // Os filtros de linha, rota e consórcio agora são aplicados na API
    // Mas mantemos aqui como filtro adicional caso necessário
    return true;
  });

  // Auto refresh every 60 seconds (apenas se tempo real estiver ativo E já tiver sido feita uma busca)
  useEffect(() => {
    if (!hasSearched) return;

    const interval = setInterval(() => {
      refreshTrips();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshTrips, hasSearched]);

  useEffect(() => {
    async function getLinhas() {
      try {
        if (!clienteLocalStorage?.idCliente) return;

        const response = await api.get<any[]>(
          `${ApiPrefix.SERVICE_API}/linhasTrajetos/${clienteLocalStorage.idCliente}`
        );
        if (response.data) {
          response.data.sort((a, b) => {
            return a.descr > b.descr ? 1 : b.descr > a.descr ? -1 : 0;
          });

          setLines(response.data);
        }
      } catch (e) {
        console.log(e);
        toast({ title: t("consultLinesFail") });
      }
    }

    async function getAgrupamentos() {
      try {
        if (!clienteLocalStorage?.idCliente) return;

        const response = await api.get<any>(
          `${ApiPrefix.SERVICE_API}/consorcio/consultarTodosPorCliente?idCliente=${clienteLocalStorage.idCliente}`
        );
        if (response.data) {
          setConsortiums(response.data);
        }
      } catch (e) {
        console.log(e);
        toast({
          title: t("consultConsortiumFail"),
        });
      }
    }

    getLinhas();
    getAgrupamentos();
  }, []);

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
    lines,
    consortiums,
    routes,
    setRoutes,
    consultTrips,
    hasSearched,
  };
};
