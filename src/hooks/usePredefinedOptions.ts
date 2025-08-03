import { useTranslation } from 'react-i18next';

export const usePredefinedOptions = () => {
  const { t } = useTranslation();

  const predefinedMessages = [
    { value: 'GPS_PROBLEMS', label: t('gpsProblems') },
    { value: 'TRAFFIC_DELAY', label: t('trafficDelay') },
    { value: 'MECHANICAL_PROBLEM', label: t('mechanicalProblem') },
    { value: 'PASSENGER_PROBLEM', label: t('passengerProblem') },
    { value: 'ACCIDENT', label: t('accident') },
    { value: 'OTHERS', label: t('others') },
  ];

  const reasonOptions = [
    { value: 'delay', label: t('delay') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'reinforcement', label: t('reinforcement') },
  ];

  const serviceOptions = [
    { value: 'T510', label: 'T510' },
    { value: 'T511', label: 'T511' },
    { value: 'T512', label: 'T512' },
    { value: 'T513', label: 'T513' },
  ];

  const routeOptions = [
    { value: 'T51000I', label: 'T51000I' },
    { value: 'T51000V', label: 'T51000V' },
    { value: 'T51001I', label: 'T51001I' },
    { value: 'T51001V', label: 'T51001V' },
  ];

  const journeyOptions = [
    { value: '1a', label: '1a' },
    { value: '1b', label: '1b' },
    { value: '2a', label: '2a' },
    { value: '2b', label: '2b' },
    { value: '3a', label: '3a' },
    { value: '3b', label: '3b' },
  ];

  const lineOptions = [
    { value: 'linha01', label: 'Linha 01' },
    { value: 'linha02', label: 'Linha 02' },
    { value: 'linha03', label: 'Linha 03' },
  ];

  const trajetoOptions = [
    { value: 'terminal-centro', label: 'Terminal - Centro' },
    { value: 'centro-terminal', label: 'Centro - Terminal' },
  ];

  const vehicleOptions = [
    { value: 'veiculo001', label: 'Veículo 001' },
    { value: 'veiculo002', label: 'Veículo 002' },
  ];

  const driverOptions = [
    { value: 'motorista1', label: 'João Silva' },
    { value: 'motorista2', label: 'Maria Santos' },
  ];

  return {
    predefinedMessages,
    reasonOptions,
    serviceOptions,
    routeOptions,
    journeyOptions,
    lineOptions,
    trajetoOptions,
    vehicleOptions,
    driverOptions,
  };
};