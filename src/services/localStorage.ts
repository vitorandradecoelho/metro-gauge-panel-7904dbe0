import api from './api';

interface ICliente {
  idCliente: number;
  gmtCliente: string;
  nomeUsuario: string;
  idUsuario: string;
  empresas: number[];
  acessos: object[];
  inicioDiaOperacional: string;
}

let language: any = null;
let token: any = null;
let cliente: ICliente = {
  idCliente: 0,
  acessos: [],
  empresas: [],
  gmtCliente: '',
  nomeUsuario: '',
  idUsuario: '',
  inicioDiaOperacional: '00:00:00',
};

export const initGetLocalStorage = async (urlToken?: string | null, urlZone?: string | null) => {
  // Get token from URL params or localStorage
  if (urlToken) {
    token = urlToken;
    localStorage.setItem('token', token);
  } else {
    token = localStorage.getItem('token');
  }

  // Get zone from URL params or localStorage/sessionStorage
  if (urlZone) {
    sessionStorage.setItem('zn', urlZone);
    localStorage.setItem('zone', urlZone);
  }

  if (!token) {
    throw new Error('No token available');
  }

  try {
    const response = await api.get<any>('/user/data');

    language = response.data.conf?.lang || 'pt-BR';
    cliente.idCliente = response.data.cli?.id || 0;
    cliente.gmtCliente = response.data.cli?.tz || 'America/Fortaleza';
    cliente.acessos = response.data.user?.acss || [];
    cliente.empresas = response.data.user?.emp || [];
    cliente.nomeUsuario = response.data.user?.nm || '';
    cliente.idUsuario = response.data.user?.id || '';
    
    let chaveDiaOperacional;
    if (response.data.conf?.keys) {
      chaveDiaOperacional = response.data.conf.keys.find((item: any) => item.chave === 'INICIO_DIA_OPERACIONAL');
    }
    cliente.inicioDiaOperacional = chaveDiaOperacional ? chaveDiaOperacional.valor : '00:00:00';

    return true;
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

export const getToken = (): string | null => {
  return token;
};

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};

export const clearToken = () => {
  token = null;
  localStorage.removeItem('token');
  sessionStorage.removeItem('zn');
};

export const getLanguage = (): string => {
  return language || 'pt-BR';
};

export const getClienteLocalStorage = (): ICliente => {
  return cliente;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};