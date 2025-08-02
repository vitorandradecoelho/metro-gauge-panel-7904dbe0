import axios from 'axios';
import { getToken } from './localStorage';

const api = axios.create({
  baseURL: 'https://planejamento-viagem-api.sinopticoplus.com/planejamento-viagem-api/v1'
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Zone = sessionStorage.getItem('zn') || localStorage.getItem('zone') || '4';
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      sessionStorage.removeItem('zn');
      window.location.href = '/login'; // Redirect to login if you have one
    }
    return Promise.reject(error);
  }
);

// API service functions
export const linesService = {
  getLines: async () => {
    const response = await api.get('/service-api/linhasTrajetos/1241');
    return response.data;
  }
};

export const tripsService = {
  editTrip: async (tripData: any) => {
    const response = await api.post('/api/controlePartida/209/editarviagem', tripData);
    return response.data;
  }
};

export default api;