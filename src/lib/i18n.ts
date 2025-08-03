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
        
        // Action menu
        'view': 'Arrastar',
        'edit': 'Editar Viagem',
        'duplicate': 'Duplicar',
        'delete': 'Excluir',
        
        // Modal titles
        'registerTrip': 'CADASTRAR VIAGEM',
        'editTrip': 'EDITAR VIAGEM',
        'includeObservation': 'INCLUIR OBSERVAÇÃO',
        'deleteTrip': 'EXCLUIR VIAGEM',
        'includeSchedule': 'INCLUIR HORÁRIO',
        'editSchedule': 'EDITAR HORÁRIO',
        
        // Form fields
        'lineField': 'Linha',
        'routeField': 'Trajeto',
        'initialDate': 'Data Inicial',
        'finalDate': 'Data Final',
        'initialTime': 'Hora Inicial',
        'finalTime': 'Hora Final',
        'driverField': 'Motorista',
        'arrivalToPoint': 'Chegada ao ponto',
        'arrivalTime': 'Hora Chegada',
        'passengerCount': 'Quantidade de Passageiros',
        'predefinedReasons': 'Motivos Predefinidos',
        'observation': 'Observação',
        'allocateTrip': 'Alocar Viagem',
        'operation': 'Operação',
        'service': 'Serviço',
        'journey': 'Jornada',
        'startTime': 'Hora Início',
        'endTime': 'Hora Fim',
        'changeJourney': 'Alterar jornada',
        'predefinedMessage': 'Mensagem Predefinida',
        'writeObservation': 'Escreva uma Observação',
        'exclusionReason': 'Motivo da Exclusão',
        
        // Buttons
        'saveAndAllocate': 'SALVAR + ALOCAR',
        'saving': 'Salvando...',
        'deleting': 'Excluindo...',
        
        // Placeholders
        'consultByLine': 'Consulte pela linha',
        'consultByRoute': 'Consulte pelo trajeto',
        'selectOne': 'Selecione um',
        'typeObservation': 'Digite sua observação...',
        'typeDeletionReason': 'Digite o motivo da exclusão...',
        
        // Messages
        'requiredFields': '*Campos Obrigatórios',
        'selectOperation': 'Por favor, selecione uma operação.',
        'fillStartEndTimes': 'Por favor, preencha os horários de início e fim.',
        'fillAllRequiredFields': 'Por favor, preencha todos os campos obrigatórios.',
        'selectMessageOrWrite': 'Por favor, selecione uma mensagem predefinida ou escreva uma observação.',
        'writeDeletionReason': 'Por favor, escreva o motivo da exclusão.',
        
        // Success messages
        'scheduleEditedSuccess': 'Horário editado com sucesso!',
        'scheduleDeletedSuccess': 'Horários eliminados com sucesso!',
        'tripEditedSuccess': 'Viagem editada com sucesso',
        'tripEditedAndAllocated': 'Viagem editada e alocada',
        'observationIncludedSuccess': 'Observação incluída com sucesso!',
        'tripDeletedSuccess': 'Viagem excluída com sucesso!',
        'scheduleIncludedSuccess': 'Horário incluído com sucesso!',
        
        // Error messages
        'scheduleEditError': 'Erro ao editar horário. Tente novamente.',
        'scheduleDeleteError': 'Erro ao eliminar horários. Tente novamente.',
        'tripEditError': 'Erro ao editar viagem',
        'tripEditErrorDesc': 'Ocorreu um erro ao tentar editar a viagem',
        'observationIncludeError': 'Erro ao incluir observação. Tente novamente.',
        'tripDeleteError': 'Erro ao excluir viagem. Tente novamente.',
        'scheduleIncludeError': 'Erro ao incluir horário. Tente novamente.',
        
        // Predefined messages
        'gpsProblems': 'PROBLEMA GPS',
        'trafficDelay': 'ATRASO NO TRÂNSITO',
        'mechanicalProblem': 'PROBLEMA MECÂNICO',
        'passengerProblem': 'PASSAGEIRO PROBLEMA',
        'accident': 'ACIDENTE',
        'others': 'OUTROS',
        'operationalManeuver': 'MANOBRA OPERACIONAL',
        'delay': 'Atraso',
        'maintenance': 'Manutenção',
        'reinforcement': 'Reforço',
        
        // Operations
        'editOp': 'Editar',
        'deleteOp': 'Eliminar',
        
        // Confirmation
        'areYouSure': 'Você tem certeza?',
        'schedulesWillBeDeleted': 'Os horários das jornadas serão eliminados:',
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
        
        // Action menu
        'view': 'Drag',
        'edit': 'Edit Trip',
        'duplicate': 'Duplicate',
        'delete': 'Delete',
        
        // Modal titles
        'registerTrip': 'REGISTER TRIP',
        'editTrip': 'EDIT TRIP',
        'includeObservation': 'INCLUDE OBSERVATION',
        'deleteTrip': 'DELETE TRIP',
        'includeSchedule': 'INCLUDE SCHEDULE',
        'editSchedule': 'EDIT SCHEDULE',
        
        // Form fields
        'lineField': 'Line',
        'routeField': 'Route',
        'initialDate': 'Initial Date',
        'finalDate': 'Final Date',
        'initialTime': 'Initial Time',
        'finalTime': 'Final Time',
        'driverField': 'Driver',
        'arrivalToPoint': 'Arrival to point',
        'arrivalTime': 'Arrival Time',
        'passengerCount': 'Passenger Count',
        'predefinedReasons': 'Predefined Reasons',
        'observation': 'Observation',
        'allocateTrip': 'Allocate Trip',
        'operation': 'Operation',
        'service': 'Service',
        'journey': 'Journey',
        'startTime': 'Start Time',
        'endTime': 'End Time',
        'changeJourney': 'Change journey',
        'predefinedMessage': 'Predefined Message',
        'writeObservation': 'Write an Observation',
        'exclusionReason': 'Exclusion Reason',
        
        // Buttons
        'saveAndAllocate': 'SAVE + ALLOCATE',
        'saving': 'Saving...',
        'deleting': 'Deleting...',
        
        // Placeholders
        'consultByLine': 'Consult by line',
        'consultByRoute': 'Consult by route',
        'selectOne': 'Select one',
        'typeObservation': 'Type your observation...',
        'typeDeletionReason': 'Type the deletion reason...',
        
        // Messages
        'requiredFields': '*Required Fields',
        'selectOperation': 'Please select an operation.',
        'fillStartEndTimes': 'Please fill in the start and end times.',
        'fillAllRequiredFields': 'Please fill in all required fields.',
        'selectMessageOrWrite': 'Please select a predefined message or write an observation.',
        'writeDeletionReason': 'Please write the deletion reason.',
        
        // Success messages
        'scheduleEditedSuccess': 'Schedule edited successfully!',
        'scheduleDeletedSuccess': 'Schedules deleted successfully!',
        'tripEditedSuccess': 'Trip edited successfully',
        'tripEditedAndAllocated': 'Trip edited and allocated',
        'observationIncludedSuccess': 'Observation included successfully!',
        'tripDeletedSuccess': 'Trip deleted successfully!',
        'scheduleIncludedSuccess': 'Schedule included successfully!',
        
        // Error messages
        'scheduleEditError': 'Error editing schedule. Try again.',
        'scheduleDeleteError': 'Error deleting schedules. Try again.',
        'tripEditError': 'Error editing trip',
        'tripEditErrorDesc': 'An error occurred while trying to edit the trip',
        'observationIncludeError': 'Error including observation. Try again.',
        'tripDeleteError': 'Error deleting trip. Try again.',
        'scheduleIncludeError': 'Error including schedule. Try again.',
        
        // Predefined messages
        'gpsProblems': 'GPS PROBLEMS',
        'trafficDelay': 'TRAFFIC DELAY',
        'mechanicalProblem': 'MECHANICAL PROBLEM',
        'passengerProblem': 'PASSENGER PROBLEM',
        'accident': 'ACCIDENT',
        'others': 'OTHERS',
        'operationalManeuver': 'OPERATIONAL MANEUVER',
        'delay': 'Delay',
        'maintenance': 'Maintenance',
        'reinforcement': 'Reinforcement',
        
        // Operations
        'editOp': 'Edit',
        'deleteOp': 'Delete',
        
        // Confirmation
        'areYouSure': 'Are you sure?',
        'schedulesWillBeDeleted': 'The journey schedules will be deleted:',
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
        
        // Action menu
        'view': 'Arrastrar',
        'edit': 'Editar Viaje',
        'duplicate': 'Duplicar',
        'delete': 'Eliminar',
        
        // Modal titles
        'registerTrip': 'REGISTRAR VIAJE',
        'editTrip': 'EDITAR VIAJE',
        'includeObservation': 'INCLUIR OBSERVACIÓN',
        'deleteTrip': 'ELIMINAR VIAJE',
        'includeSchedule': 'INCLUIR HORARIO',
        'editSchedule': 'EDITAR HORARIO',
        
        // Form fields
        'lineField': 'Línea',
        'routeField': 'Ruta',
        'initialDate': 'Fecha Inicial',
        'finalDate': 'Fecha Final',
        'initialTime': 'Hora Inicial',
        'finalTime': 'Hora Final',
        'driverField': 'Conductor',
        'arrivalToPoint': 'Llegada al punto',
        'arrivalTime': 'Hora Llegada',
        'passengerCount': 'Cantidad de Pasajeros',
        'predefinedReasons': 'Motivos Predefinidos',
        'observation': 'Observación',
        'allocateTrip': 'Asignar Viaje',
        'operation': 'Operación',
        'service': 'Servicio',
        'journey': 'Jornada',
        'startTime': 'Hora Inicio',
        'endTime': 'Hora Fin',
        'changeJourney': 'Alterar jornada',
        'predefinedMessage': 'Mensaje Predefinido',
        'writeObservation': 'Escriba una Observación',
        'exclusionReason': 'Motivo de Exclusión',
        
        // Buttons
        'saveAndAllocate': 'GUARDAR + ASIGNAR',
        'saving': 'Guardando...',
        'deleting': 'Eliminando...',
        
        // Placeholders
        'consultByLine': 'Consulte por la línea',
        'consultByRoute': 'Consulte por la ruta',
        'selectOne': 'Seleccione uno',
        'typeObservation': 'Digite su observación...',
        'typeDeletionReason': 'Digite el motivo de la exclusión...',
        
        // Messages
        'requiredFields': '*Campos Obligatorios',
        'selectOperation': 'Por favor, seleccione una operación.',
        'fillStartEndTimes': 'Por favor, complete los horarios de inicio y fin.',
        'fillAllRequiredFields': 'Por favor, complete todos los campos obligatorios.',
        'selectMessageOrWrite': 'Por favor, seleccione un mensaje predefinido o escriba una observación.',
        'writeDeletionReason': 'Por favor, escriba el motivo de la exclusión.',
        
        // Success messages
        'scheduleEditedSuccess': 'Horario editado exitosamente!',
        'scheduleDeletedSuccess': 'Horarios eliminados exitosamente!',
        'tripEditedSuccess': 'Viaje editado exitosamente',
        'tripEditedAndAllocated': 'Viaje editado y asignado',
        'observationIncludedSuccess': 'Observación incluida exitosamente!',
        'tripDeletedSuccess': 'Viaje eliminado exitosamente!',
        'scheduleIncludedSuccess': 'Horario incluido exitosamente!',
        
        // Error messages
        'scheduleEditError': 'Error al editar horario. Intente nuevamente.',
        'scheduleDeleteError': 'Error al eliminar horarios. Intente nuevamente.',
        'tripEditError': 'Error al editar viaje',
        'tripEditErrorDesc': 'Ocurrió un error al intentar editar el viaje',
        'observationIncludeError': 'Error al incluir observación. Intente nuevamente.',
        'tripDeleteError': 'Error al eliminar viaje. Intente nuevamente.',
        'scheduleIncludeError': 'Error al incluir horario. Intente nuevamente.',
        
        // Predefined messages
        'gpsProblems': 'PROBLEMAS GPS',
        'trafficDelay': 'ATRASO EN EL TRÁFICO',
        'mechanicalProblem': 'PROBLEMA MECÁNICO',
        'passengerProblem': 'PASAJERO PROBLEMA',
        'accident': 'ACCIDENTE',
        'others': 'OTROS',
        'operationalManeuver': 'MANIOBRA OPERACIONAL',
        'delay': 'Atraso',
        'maintenance': 'Mantenimiento',
        'reinforcement': 'Refuerzo',
        
        // Operations
        'editOp': 'Editar',
        'deleteOp': 'Eliminar',
        
        // Confirmation
        'areYouSure': '¿Estás seguro?',
        'schedulesWillBeDeleted': 'Los horarios de las jornadas se eliminarán:',
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