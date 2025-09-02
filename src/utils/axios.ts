import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({ 
  baseURL: import.meta.env.VITE_APP_API_URL || 'https://localhost',
  // En développement, accepter les certificats auto-signés
  ...(import.meta.env.DEV && { timeout: 10000 })
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vérifier si c'est une erreur réseau (pas de réponse du serveur)
    if (!error.response) {
      console.error('Network error or CORS issue:', error.message);
    }
    
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/maintenance/500';
    }
    return Promise.reject((error.response && error.response.data) || error.message || 'Network Error');
  }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
