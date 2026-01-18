window.APP_CONFIG = {
    // Esta configuración permite sobrescribir la URL del backend si es necesario
    // Por defecto, api.js detectará la URL automáticamente
    getBackendUrl: function () {
        // Si necesitas usar una URL específica (ej: ngrok), cámbiala aquí
        // return "https://tu-url-de-ngrok.ngrok-free.app";
        return null; // Retornar null para usar la detección automática
    }
};
