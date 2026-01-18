# Mathi Phone - Despliegue en Render.com

## 📋 Pasos para desplegar en Render.com

### 1. Preparación del Repositorio
- [ ] Asegúrate de que todo el código esté en GitHub
- [ ] El archivo `render.yaml` está en la raíz del proyecto
- [ ] Las variables de entorno están configuradas

### 2. Configurar Variables de Entorno en Render

#### Backend Service (mathi-phone-api):
- `MONGO_URL`: Tu URL de MongoDB Atlas
- `DB_NAME`: mathi_phone
- `CORS_ORIGINS`: https://mathi-phone.onrender.com,https://mathi-phone-api.onrender.com

#### Frontend Service (mathi-phone):
- `REACT_APP_BACKEND_URL`: https://mathi-phone-api.onrender.com

### 3. Pasos en Render.com

1. **Crear cuenta en Render.com**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Conectar repositorio**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio de mathi-phone

3. **Configurar el servicio**
   - Render detectará automáticamente el `render.yaml`
   - Creará dos servicios: API y Frontend
   - Confirma la configuración

4. **Configurar variables de entorno**
   - Ve a cada servicio → "Environment"
   - Agrega las variables mencionadas arriba
   - Especialmente importante: `MONGO_URL`

### 4. URLs Finales
- Frontend: https://mathi-phone.onrender.com
- API: https://mathi-phone-api.onrender.com
- Documentación: https://mathi-phone-api.onrender.com/docs

### 5. Verificación
- [ ] Frontend carga correctamente
- [ ] Los productos se muestran desde MongoDB
- [ ] La API responde correctamente
- [ ] No hay errores de CORS

## 🔧 Archivos Modificados

1. **render.yaml**: Configuración de despliegue
2. **backend/server.py**: CORS configurado para dominios de Render
3. **frontend/public/config.js**: Detección automática de entorno
4. **build.sh**: Script de construcción

## ⚠️ Notas Importantes

- El plan gratuito de Render tiene límites de uso
- Los servicios se duermen después de 15 minutos de inactividad
- Pueden tardar hasta 30 segundos en despertar
- MongoDB Atlas debe permitir conexiones desde cualquier IP (0.0.0.0/0)

## 🚀 Despliegue Automático

Cada vez que hagas push a tu rama principal:
- Render reconstruirá automáticamente
- El frontend y backend se actualizarán
- Los cambios estarán disponibles en minutos
