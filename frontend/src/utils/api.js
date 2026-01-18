import axios from 'axios';

// Detectar automáticamente la URL del backend
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;

  // Si estamos en producción en Render
  if (hostname.includes('onrender.com')) {
    // Si es el servicio de frontend (mathi-phone), el backend está en mathi-api
    if (hostname.includes('mathi-phone')) {
      return 'https://mathi-api.onrender.com';
    }
    // En cualquier otro caso en render, usar el mismo origen
    return window.location.origin;
  }

  // Si estamos en localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8001';
  }

  // Si estamos en ngrok
  if (hostname.includes('ngrok') || hostname.includes('ngrok-free')) {
    return 'http://localhost:8001';
  }

  // Fallback a variables de entorno o puerto 8001 en la misma IP
  return process.env.REACT_APP_BACKEND_URL || `${window.location.protocol}//${hostname}:8001`;
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
    if (filters.category) params.append('category', filters.category);
    Object.keys(filters).forEach(key => {
      if (key !== 'category' && filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const response = await axiosInstance.get(`/products?${params.toString()}`);

    // Manejar el formato de respuesta del backend
    let products = [];
    if (response.data) {
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.value && Array.isArray(response.data.value)) {
        products = response.data.value;
      }
    }
    return products;
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
  },

  // Image upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API}/upload-image`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Error al subir la imagen');
    const data = await response.json();
    // Prepend BACKEND_URL if the image_url is relative
    if (data.image_url.startsWith('/')) {
      return `${BACKEND_URL}${data.image_url}`;
    }
    return data.image_url;
  }
};

export default api;