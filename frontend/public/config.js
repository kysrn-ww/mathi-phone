// Configuración dinámica para backend
window.APP_CONFIG = {
  getBackendUrl: function() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Si estamos en producción en Render
    if (hostname.includes('onrender.com')) {
      // Si es el frontend principal, usar la API
      if (hostname === 'mathi-phone.onrender.com') {
        return 'https://mathi-phone-api.onrender.com';
      }
      // Si es la API, usar la misma URL
      return `https://${hostname}`;
    }
    
    // Si estamos en el mismo servidor que el backend (port 8001)
    if (port === '8001') {
      return `${window.location.protocol}//${hostname}:8001`;
    }
    
    // Si estamos en ngrok - usar localhost para backend (backend en tu PC)
    if (hostname.includes('ngrok') || hostname.includes('ngrok-free')) {
      return 'http://localhost:8001';
    }
    
    // Si estamos en localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8001';
    }
    
    // Para producción o IP directa
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:8001`;
  }
};

// Debug: Mostrar la URL del backend en consola
console.log('Backend URL configurada:', window.APP_CONFIG.getBackendUrl());
