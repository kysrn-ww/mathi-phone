# 🍎 Mathi Phone - Tu Tienda Apple Premium

Una aplicación web full-stack moderna y minimalista para vender productos Apple, construida con React, FastAPI y MongoDB.

## ✨ Características Principales

### 🎨 Diseño
- **Tema Negro Minimalista** estilo Apple
- **Dark/Light Mode** con persistencia en localStorage
- **Totalmente Responsive** - Mobile, Tablet, Desktop
- **Animaciones Suaves** con transiciones CSS avanzadas
- **Progress Bar** de scroll

### 📱 Productos
- **27 iPhones** precargados (iPhone 11 hasta iPhone 17 Pro Max)
- **Filtros Avanzados**: Modelo, Tipo, Estado, Batería
- **Búsqueda en Tiempo Real** por nombre, color, chip, etc.
- **Detalles Completos** de cada producto
- **Imágenes Reales** de Apple Store

### 💱 Conversor de Divisas
- **USD** - Dólares Estadounidenses
- **ARS** - Pesos Argentinos
- **USDT** - Tether (Stablecoin)
- **BTC** - Bitcoin
- **ETH** - Ethereum
- **Actualización Automática** cada 5 minutos

### 🔄 Comparación de Productos
- Compara hasta **3 productos** simultáneamente
- Vista detallada de especificaciones lado a lado
- Comparación de precios en múltiples monedas

### 🎯 Backend Robusto
- **RESTful API** con FastAPI
- **MongoDB** para almacenamiento de datos
- **Validación** con Pydantic
- **CORS** configurado
- **Exchange Rates** en tiempo real desde APIs públicas

## 🚀 Tecnologías Utilizadas

### Frontend
- React 18
- React Router v6
- Axios
- Context API (Theme, Compare)
- CSS3 (Variables, Grid, Flexbox, Animations)

### Backend
- FastAPI
- Motor (MongoDB Async Driver)
- Pydantic
- Python-dotenv
- Requests

### Database
- MongoDB

## 📦 Estructura del Proyecto

```
/app
├── backend/
│   ├── server.py              # API principal
│   ├── seed_products.py       # Script para poblar DB
│   ├── requirements.txt       # Dependencias Python
│   └── .env                   # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Header.js
│   │   │   ├── Hero.js
│   │   │   ├── Categories.js
│   │   │   ├── SearchBar.js
│   │   │   ├── FilterSection.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CurrencyConverter.js
│   │   │   ├── Contact.js
│   │   │   ├── Footer.js
│   │   │   └── ProgressBar.js
│   │   ├── pages/             # Páginas
│   │   │   ├── Home.js
│   │   │   ├── ProductDetail.js
│   │   │   └── Compare.js
│   │   ├── contexts/          # Context API
│   │   │   ├── ThemeContext.js
│   │   │   └── CompareContext.js
│   │   ├── utils/             # Utilidades
│   │   │   ├── api.js
│   │   │   └── currency.js
│   │   ├── App.js             # Componente principal
│   │   └── App.css            # Estilos globales
│   ├── package.json
│   └── .env
└── README.md
```

## 🔧 API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos (con filtros opcionales)
- `GET /api/products/{id}` - Obtener un producto específico
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Filtros Disponibles
- `model`: 11, 12, 13, 14, 15, 16, 17, se
- `type`: pro-max, pro, plus, normal, mini, se
- `condition`: sealed, like-new, excellent, good
- `min_battery`: 0-100
- `max_price_ars`: float
- `max_price_usd`: float
- `available`: boolean
- `search`: string

### Exchange Rates
- `GET /api/exchange-rates` - Obtener tasas de cambio actuales

## 🎨 Diseño y UX

### Paleta de Colores
- **Fondo**: Negro puro (#000000)
- **Cards**: Gris oscuro (#1a1a1a)
- **Texto**: Blanco (#ffffff) y grises
- **Acento**: Azul Apple (#0071e3)
- **Status**: Verde, Amarillo, Rojo

### Tipografía
- **Font**: SF Pro Display, -apple-system
- **Weights**: 300, 400, 600, 700
- **Sizes**: Responsive con clamp()

### Animaciones
- **Hover Effects**: Scale, Transform, Shadow
- **Page Transitions**: Fade In Up
- **Smooth Scroll**: Behavior smooth
- **Loading States**: Spinner animado

## 🌐 Características Responsive

### Mobile (< 768px)
- Menú hamburguesa
- Grid de 1 columna
- Botones full-width
- Navegación optimizada

### Tablet (768px - 1024px)
- Grid de 2 columnas
- Layout adaptativo
- Touch optimizado

### Desktop (> 1024px)
- Grid de 3-4 columnas
- Hover effects completos
- Layout espacioso

## 📱 Productos Precargados

La base de datos incluye **27 iPhones** con:
- **iPhone 17**: Pro Max, Pro
- **iPhone 16**: Pro Max, Pro, Plus, Normal
- **iPhone 15**: Pro Max, Pro, Plus, Normal
- **iPhone 14**: Pro Max, Pro, Plus, Normal
- **iPhone 13**: Pro Max, Pro, Normal, Mini
- **iPhone 12**: Pro Max, Pro, Normal, Mini
- **iPhone 11**: Pro Max, Pro, Normal
- **iPhone SE**: 3ra Generación (2 variantes)

### Datos de Cada Producto
- Nombre completo
- Modelo y tipo
- Almacenamiento (64GB - 1TB)
- Color
- Estado (Sellado, Como Nuevo, Excelente, Bueno)
- Salud de batería (64% - 100%)
- Precio en ARS y USD
- Tamaño de pantalla
- Chip
- Cámara
- Características (5G, ProMotion, etc.)
- Garantía (0-12 meses)
- Descripción
- URL de imagen

## 🔄 Conversor de Divisas

### APIs Utilizadas
- **CoinGecko**: Precios de BTC, ETH, USDT
- **ExchangeRate API**: Tasa USD/ARS

### Actualización
- Cada **5 minutos** automáticamente
- Muestra timestamp de última actualización
- Fallback a valores por defecto si falla la API

## 🎯 Próximas Mejoras

1. **Carrito de Compras**
   - Agregar productos al carrito
   - Checkout process
   - Integración con pagos

2. **Sistema de Usuarios**
   - Registro y login
   - Perfil de usuario
   - Historial de compras

3. **Panel de Administración**
   - Gestión de productos
   - Estadísticas de ventas
   - Control de inventario

4. **Notificaciones**
   - Email cuando un producto está disponible
   - WhatsApp integration mejorada
   - Push notifications

5. **Mejoras en Búsqueda**
   - Búsqueda por rango de precios
   - Ordenamiento avanzado
   - Filtros guardados

6. **SEO y Performance**
   - Meta tags dinámicos
   - Server-side rendering
   - Image optimization
   - PWA support

## 🐛 Testing

La aplicación incluye `data-testid` en todos los elementos interactivos para facilitar testing:

```javascript
// Ejemplos de tests
<header data-testid="main-header">
<button data-testid="theme-toggle-btn">
<div data-testid="product-card">
<button data-testid="btn-add-to-compare">
```

## 📞 Contacto

### Actualizar Información de Contacto

En `/app/frontend/src/components/Contact.js`:

```javascript
const whatsappNumber = 'TU_NUMERO'; // Ej: 5491234567890
const instagramHandle = 'TU_USUARIO'; // Ej: mathiphone
```

## 🔐 Variables de Entorno

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=mathi_phone
CORS_ORIGINS=*
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://your-backend-url
```

## 🚀 Comandos Útiles

### Reiniciar Servicios
```bash
sudo supervisorctl restart all
```

### Ver Logs
```bash
# Backend
tail -f /var/log/supervisor/backend.*.log

# Frontend
tail -f /var/log/supervisor/frontend.*.log
```

### Poblar Base de Datos
```bash
cd /app/backend
python seed_products.py
```

### Verificar APIs
```bash
# Productos
curl http://localhost:8001/api/products

# Exchange rates
curl http://localhost:8001/api/exchange-rates
```

## 💡 Tips de Desarrollo

1. **Hot Reload**: Frontend y backend tienen hot reload activado
2. **MongoDB**: Base de datos local en puerto 27017
3. **CORS**: Ya configurado para desarrollo
4. **Imágenes**: URLs de Apple Store (pueden expirar)
5. **Tasas de Cambio**: APIs públicas gratuitas (pueden tener límites)

## 🎉 Características Destacadas

### ✨ Experiencia de Usuario
- **Carga Rápida**: Lazy loading de imágenes
- **Navegación Suave**: Smooth scroll en toda la app
- **Feedback Visual**: Animaciones en cada interacción
- **Estados de Carga**: Spinners y skeletons
- **Error Handling**: Mensajes claros y acciones sugeridas

### 🔍 Accesibilidad
- **ARIA Labels**: En elementos interactivos
- **Keyboard Navigation**: Totalmente navegable con teclado
- **Focus Visible**: Indicadores de focus claros
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Textos descriptivos

### 📊 Performance
- **Code Splitting**: Por rutas
- **Lazy Loading**: Imágenes y componentes
- **Memoization**: React.memo en componentes pesados
- **Debouncing**: En búsqueda
- **Caching**: Exchange rates con timestamp

## 🏆 Estado Actual

✅ **Backend Completo** - API RESTful funcionando
✅ **Frontend Completo** - React SPA con routing
✅ **Base de Datos** - 27 productos precargados
✅ **Conversor de Divisas** - 5 monedas soportadas
✅ **Dark/Light Mode** - Con persistencia
✅ **Comparación** - Hasta 3 productos
✅ **Búsqueda y Filtros** - Totalmente funcionales
✅ **Responsive** - Mobile, Tablet, Desktop
✅ **Diseño Minimalista** - Estilo Apple

---

**Desarrollado con ❤️ por el equipo de Mathi Phone**

*"Tu tienda Apple premium. Calidad, confianza y los mejores precios."*
