import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  'pt-BR': {
    translation: {
      // Navigation and Layout
      'title': 'Monitor de Viagens',
      'refresh': 'Atualizar',
      'filters': 'Filtros',
      'hideFilters': 'Ocultar Filtros',
      'showFilters': 'Mostrar Filtros',
      'hideColumns': 'Ocultar Colunas',
      'actions': 'Ações',
      'darkMode': 'Modo Escuro',
      'lightMode': 'Modo Claro',
      'language': 'Idioma',
      
      // Status tabs
      'all': 'Todos',
      'completed': 'Realizadas',
      'inProgress': 'Em Andamento',
      'planned': 'Planejadas',
      'notStarted': 'Não Iniciadas',
      
      // Status values
      'VIAGEM PLANEJADA E REALIZADA': 'Realizada',
      'EM ANDAMENTO': 'Em Andamento',
      'NÃO INICIADA': 'Não Iniciada',
      
      // Table columns
      'date': 'Data',
      'status': 'Status',
      'line': 'Linha',
      'route': 'Trajeto',
      'execution': 'Execução',
      'plannedVehicle': 'Veículo Plan.',
      'realVehicle': 'Veículo Real',
      'tab': 'Tab',
      'passengers': 'Passageiros',
      'plannedStart': 'Início Plan.',
      'realStart': 'Início Real',
      'startDiff': 'Diff Início',
      'plannedEnd': 'Fim Plan.',
      'realEnd': 'Fim Real',
      'endDiff': 'Diff Fim',
      'headway': 'Headway',
      'driver': 'Motorista',
      'travelTime': 'Tempo Viagem',
      'completion': 'Conclusão',
      
      // Filters
      'filterLine': 'Filtrar por Linha',
      'filterRoute': 'Filtrar por Trajeto',
      'filterConsortium': 'Filtrar por Consórcio',
      'selectLine': 'Selecione uma linha',
      'selectRoute': 'Selecione um trajeto',
      'selectConsortium': 'Selecione um consórcio',
      'allLines': 'Todas as Linhas',
      'allRoutes': 'Todos os Trajetos',
      'allConsortiums': 'Todos os Consórcios',
      
      // Modal
      'hello': 'Olá Mundo',
      'close': 'Fechar',
      'details': 'Detalhes',
      
      // Route values
      'ida': 'Ida',
      'volta': 'Volta',
      
      // Execution values
      'Fechada': 'Fechada',
      'Aberta': 'Aberta',
      'Não Iniciada': 'Não Iniciada',
      
      // Languages
      'português': 'Português (Brasil)',
      'english': 'English',
      'español': 'Español (Chile)',
      
       // Additional messages
       'loading': 'Carregando',
       'noTripsFound': 'Nenhuma viagem encontrada',
       'tryAdjustingFilters': 'Tente ajustar os filtros',
       'trips': 'viagens',
       
       // Settings
       'settings': 'Configurações',
       'apiSettings': 'Configurações da API',
       'apiUrl': 'URL da API',
       'apiUrlDescription': 'Endpoint da API para buscar viagens',
       'zone': 'Zona',
       'zoneDescription': 'Número da zona enviado no cabeçalho da API',
        'save': 'Salvar',
        'settingsSaved': 'Configurações Salvas',
        'settingsUpdated': 'As configurações da API foram atualizadas com sucesso.',
        
        // Modal translations
        'actionCenter': 'CENTRAL DE AÇÕES',
        'dragVehicle': 'ARRASTAR VEÍCULO',
        'vehicle': 'Veículo',
        'select': 'SELECIONE',
        'cancel': 'CANCELAR',
        'dragCurrentTime': 'Arrastar somente para este horário',
        'dragFromTime': 'Arrastar a partir deste horário',
        'dragSameTable': 'Arrastar a partir deste horário para mesma tabela em outros trajetos',
        
        // Toast messages
        'saveSuccess': 'Ação salva com sucesso!',
        'saveError': 'Erro ao salvar ação. Tente novamente.',
    }
  },
  'en': {
    translation: {
      // Navigation and Layout
      'title': 'Trip Monitor',
      'refresh': 'Refresh',
      'filters': 'Filters',
      'hideFilters': 'Hide Filters',
      'showFilters': 'Show Filters',
      'hideColumns': 'Hide Columns',
      'actions': 'Actions',
      'darkMode': 'Dark Mode',
      'lightMode': 'Light Mode',
      'language': 'Language',
      
      // Status tabs
      'all': 'All',
      'completed': 'Completed',
      'inProgress': 'In Progress',
      'planned': 'Planned',
      'notStarted': 'Not Started',
      
      // Status values
      'VIAGEM PLANEJADA E REALIZADA': 'Completed',
      'EM ANDAMENTO': 'In Progress',
      'NÃO INICIADA': 'Not Started',
      
      // Table columns
      'date': 'Date',
      'status': 'Status',
      'line': 'Line',
      'route': 'Route',
      'execution': 'Execution',
      'plannedVehicle': 'Planned Vehicle',
      'realVehicle': 'Real Vehicle',
      'tab': 'Tab',
      'passengers': 'Passengers',
      'plannedStart': 'Planned Start',
      'realStart': 'Real Start',
      'startDiff': 'Start Diff',
      'plannedEnd': 'Planned End',
      'realEnd': 'Real End',
      'endDiff': 'End Diff',
      'headway': 'Headway',
      'driver': 'Driver',
      'travelTime': 'Travel Time',
      'completion': 'Completion',
      
      // Filters
      'filterLine': 'Filter by Line',
      'filterRoute': 'Filter by Route',
      'filterConsortium': 'Filter by Consortium',
      'selectLine': 'Select a line',
      'selectRoute': 'Select a route',
      'selectConsortium': 'Select a consortium',
      'allLines': 'All Lines',
      'allRoutes': 'All Routes',
      'allConsortiums': 'All Consortiums',
      
      // Modal
      'hello': 'Hello World',
      'close': 'Close',
      'details': 'Details',
      
      // Route values
      'ida': 'Outbound',
      'volta': 'Return',
      
      // Execution values
      'Fechada': 'Closed',
      'Aberta': 'Open',
      'Não Iniciada': 'Not Started',
      
      // Languages
      'português': 'Português (Brasil)',
      'english': 'English',
      'español': 'Español (Chile)',
      
       // Additional messages
       'loading': 'Loading',
       'noTripsFound': 'No trips found',
       'tryAdjustingFilters': 'Try adjusting the filters',
       'trips': 'trips',
       
       // Settings
       'settings': 'Settings',
       'apiSettings': 'API Settings',
       'apiUrl': 'API URL',
       'apiUrlDescription': 'URL endpoint for the trips API',
       'zone': 'Zone',
       'zoneDescription': 'Zone number to be passed in the API header',
        'save': 'Save',
        'settingsSaved': 'Settings Saved',
        'settingsUpdated': 'API settings have been updated successfully.',
        
        // Modal translations
        'actionCenter': 'ACTION CENTER',
        'dragVehicle': 'DRAG VEHICLE',
        'vehicle': 'Vehicle',
        'select': 'SELECT',
        'cancel': 'CANCEL',
        'dragCurrentTime': 'Drag only for this time',
        'dragFromTime': 'Drag from this time',
        'dragSameTable': 'Drag from this time to same table on other routes',
        
        // Toast messages
        'saveSuccess': 'Action saved successfully!',
        'saveError': 'Error saving action. Please try again.',
    }
  },
  'es-CL': {
    translation: {
      // Navigation and Layout
      'title': 'Monitor de Viajes',
      'refresh': 'Actualizar',
      'filters': 'Filtros',
      'hideFilters': 'Ocultar Filtros',
      'showFilters': 'Mostrar Filtros',
      'hideColumns': 'Ocultar Columnas',
      'actions': 'Acciones',
      'darkMode': 'Modo Oscuro',
      'lightMode': 'Modo Claro',
      'language': 'Idioma',
      
      // Status tabs
      'all': 'Todos',
      'completed': 'Realizados',
      'inProgress': 'En Progreso',
      'planned': 'Planificados',
      'notStarted': 'No Iniciados',
      
      // Status values
      'VIAGEM PLANEJADA E REALIZADA': 'Realizado',
      'EM ANDAMENTO': 'En Progreso',
      'NÃO INICIADA': 'No Iniciado',
      
      // Table columns
      'date': 'Fecha',
      'status': 'Estado',
      'line': 'Línea',
      'route': 'Ruta',
      'execution': 'Ejecución',
      'plannedVehicle': 'Vehículo Plan.',
      'realVehicle': 'Vehículo Real',
      'tab': 'Tab',
      'passengers': 'Pasajeros',
      'plannedStart': 'Inicio Plan.',
      'realStart': 'Inicio Real',
      'startDiff': 'Diff Inicio',
      'plannedEnd': 'Fin Plan.',
      'realEnd': 'Fin Real',
      'endDiff': 'Diff Fin',
      'headway': 'Headway',
      'driver': 'Conductor',
      'travelTime': 'Tiempo Viaje',
      'completion': 'Finalización',
      
      // Filters
      'filterLine': 'Filtrar por Línea',
      'filterRoute': 'Filtrar por Ruta',
      'filterConsortium': 'Filtrar por Consorcio',
      'selectLine': 'Seleccione una línea',
      'selectRoute': 'Seleccione una ruta',
      'selectConsortium': 'Seleccione un consorcio',
      'allLines': 'Todas las Líneas',
      'allRoutes': 'Todas las Rutas',
      'allConsortiums': 'Todos los Consorcios',
      
      // Modal
      'hello': 'Hola Mundo',
      'close': 'Cerrar',
      'details': 'Detalles',
      
      // Route values
      'ida': 'Ida',
      'volta': 'Vuelta',
      
      // Execution values
      'Fechada': 'Cerrada',
      'Aberta': 'Abierta',
      'Não Iniciada': 'No Iniciada',
      
      // Languages
      'português': 'Português (Brasil)',
      'english': 'English',
      'español': 'Español (Chile)',
      
       // Additional messages
       'loading': 'Cargando',
       'noTripsFound': 'No se encontraron viajes',
       'tryAdjustingFilters': 'Intenta ajustar los filtros',
       'trips': 'viajes',
       
       // Settings
       'settings': 'Configuración',
       'apiSettings': 'Configuración de API',
       'apiUrl': 'URL de API',
       'apiUrlDescription': 'Endpoint de la API para obtener viajes',
       'zone': 'Zona',
       'zoneDescription': 'Número de zona enviado en el encabezado de la API',
        'save': 'Guardar',
        'settingsSaved': 'Configuración Guardada',
        'settingsUpdated': 'La configuración de la API se ha actualizado correctamente.',
        
        // Modal translations
        'actionCenter': 'CENTRO DE ACCIONES',
        'dragVehicle': 'ARRASTRAR VEHÍCULO',
        'vehicle': 'Vehículo',
        'select': 'SELECCIONAR',
        'cancel': 'CANCELAR',
        'dragCurrentTime': 'Arrastrar solo para este horario',
        'dragFromTime': 'Arrastrar desde este horario',
        'dragSameTable': 'Arrastrar desde este horario para la misma tabla en otras rutas',
        
        // Toast messages
        'saveSuccess': '¡Acción guardada exitosamente!',
        'saveError': 'Error al guardar acción. Inténtalo de nuevo.',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
  });

export default i18n;