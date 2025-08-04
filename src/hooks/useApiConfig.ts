import { useLocalStorage } from './useLocalStorage';

interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  zone: string;
}

export const useApiConfig = () => {
  const [config, setConfig] = useLocalStorage<ApiConfig>('apiConfig', {
    baseUrl: '/api/trips',  // Default API endpoint
    zone: '4',              // Default zone
  });

  const updateBaseUrl = (url: string) => {
    setConfig({
      ...config,
      baseUrl: url
    });
  };

  const updateZone = (zone: string) => {
    setConfig({
      ...config,
      zone
    });
  };

  const updateApiKey = (apiKey: string) => {
    setConfig({
      ...config,
      apiKey
    });
  };

  return {
    config,
    updateBaseUrl,
    updateZone,
    updateApiKey
  };
};