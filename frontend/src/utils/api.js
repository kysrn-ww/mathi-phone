import axios from 'axios';

// Detectar automáticamente la URL del backend
const getBackendUrl = () => {
  // Si hay configuración global (para ngrok)
  if (window.APP_CONFIG && window.APP_CONFIG.getBackendUrl) {
    return window.APP_CONFIG.getBackendUrl();
  }
  
  // Fallback a variables de entorno
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
};

const BACKEND_URL = getBackendUrl();
const API = `${BACKEND_URL}/api`;

// Configurar axios para debugging
const axiosInstance = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Agregar interceptor para logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Backend URL:', BACKEND_URL);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Products
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const response = await axiosInstance.get(`/products?${params.toString()}`);
    
    // Manejar el formato de respuesta del backend
    if (response.data && response.data.value) {
      return response.data.value;
    }
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (product) => {
    const response = await axiosInstance.post('/products', product);
    return response.data;
  },
  
  updateProduct: async (id, product) => {
    const response = await axiosInstance.put(`/products/${id}`, product);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
  
  // Exchange rates
  getExchangeRates: async () => {
    const response = await axiosInstance.get('/exchange-rates');
    return response.data;
  }
};

export default api;