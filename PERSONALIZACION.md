# 📝 Guía Rápida de Personalización - Mathi Phone

## 🎨 Cambiar Colores del Tema

### Editar Variables CSS
Archivo: `/app/frontend/src/App.css`

```css
:root {
  /* Cambia estos colores según tu preferencia */
  --accent-primary: #0071e3;  /* Color principal (botones, links) */
  --accent-hover: #0077ed;    /* Color al pasar el mouse */
  --success: #30d158;         /* Color de éxito */
  --warning: #ff9f0a;         /* Color de advertencia */
  --error: #ff453a;           /* Color de error */
}
```

### Ejemplos de Paletas:
```css
/* Rojo Apple */
--accent-primary: #ff3b30;
--accent-hover: #ff453a;

/* Verde Esmeralda */
--accent-primary: #00c7be;
--accent-hover: #00d9d0;

/* Morado */
--accent-primary: #af52de;
--accent-hover: #bf5af2;
```

## 📞 Actualizar Información de Contacto

Archivo: `/app/frontend/src/components/Contact.js`

```javascript
const whatsappNumber = '5491234567890'; // Tu número con código de país
const instagramHandle = 'tu_usuario';    // Tu usuario de Instagram
```

**Formato WhatsApp**: Código país + número sin espacios
- Argentina: 549 + código área + número
- México: 521 + código área + número
- USA: 1 + código área + número

## 🏪 Cambiar Nombre de la Tienda

### 1. En el Header
Archivo: `/app/frontend/src/components/Header.js`
```javascript
<div className="logo">
  🍎 Tu Nombre Aquí  {/* Cambia "Mathi Phone" */}
</div>
```

### 2. En el Hero
Archivo: `/app/frontend/src/components/Hero.js`
```javascript
<h1 className="hero-title">Tu Nombre Aquí</h1>
<p className="hero-subtitle">
  Tu descripción personalizada aquí
</p>
```

### 3. En el Footer
Archivo: `/app/frontend/src/components/Footer.js`
```javascript
<p>&copy; 2025 Tu Nombre Aquí. Todos los derechos reservados.</p>
```

## 📱 Agregar Nuevos Productos

### Opción 1: Desde Python (Recomendado)
```python
cd /app/backend
python

# En el shell de Python:
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(".")
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

async def add_product():
    product = {
        "id": "tu-id-unico",
        "name": "iPhone 15 Pro",
        "model": "15",
        "type": "pro",
        "storage": "256GB",
        "color": "Negro Titanio",
        "condition": "sealed",
        "battery_health": 100,
        "price_ars": 1200000,
        "price_usd": 1200,
        "screen_size": "6.1\" Super Retina XDR",
        "chip": "A17 Pro",
        "camera": "48MP Principal",
        "features": ["5G", "ProMotion", "USB-C"],
        "available": True,
        "warranty_months": 12,
        "description": "Tu descripción aquí",
        "image_url": "https://tu-imagen.com/foto.jpg",
        "created_at": "2025-01-17T00:00:00Z",
        "updated_at": "2025-01-17T00:00:00Z"
    }
    
    await db.products.insert_one(product)
    print("Producto agregado!")

asyncio.run(add_product())
```

### Opción 2: Desde el API
```bash
curl -X POST http://localhost:8001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "model": "15",
    "type": "pro",
    "storage": "256GB",
    "color": "Negro Titanio",
    "condition": "sealed",
    "battery_health": 100,
    "price_ars": 1200000,
    "price_usd": 1200,
    "screen_size": "6.1\" Super Retina XDR",
    "chip": "A17 Pro",
    "camera": "48MP Principal",
    "features": ["5G", "ProMotion", "USB-C"],
    "available": true,
    "warranty_months": 12,
    "description": "Descripción del producto",
    "image_url": "https://url-de-imagen.com/foto.jpg"
  }'
```

## 🖼️ Cambiar Imágenes de Productos

### Opción 1: URLs de Apple (Recomendado)
```
https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/[NOMBRE-PRODUCTO]?wid=5120&hei=2880
```

### Opción 2: Subir tus propias imágenes
1. Sube las imágenes a un servicio como:
   - Cloudinary
   - AWS S3
   - Imgur
   - Firebase Storage

2. Actualiza el campo `image_url` en cada producto

## 🌍 Cambiar Idioma

### Textos Principales
Busca y reemplaza en todos los archivos:

```bash
# Desde /app/frontend/src
grep -r "Explorar Productos" .
grep -r "Consultar" .
grep -r "Agregar a comparación" .
```

### Archivos Principales con Texto:
- `components/Hero.js` - Título y subtítulo
- `components/Categories.js` - Categorías
- `components/Contact.js` - Sección de contacto
- `pages/Home.js` - Catálogo
- `pages/Compare.js` - Comparación

## 💰 Configurar Moneda Principal

### Cambiar de ARS a otra moneda
Archivo: `/app/frontend/src/components/ProductCard.js`

```javascript
// Cambia esto:
<div className="product-price">
  ${product.price_ars.toLocaleString('es-AR')}
</div>

// Por esto (ejemplo USD):
<div className="product-price">
  ${product.price_usd.toLocaleString('en-US')}
</div>
```

### Agregar Nueva Moneda al Conversor
Archivo: `/app/backend/server.py`

```python
# En la función get_exchange_rates, agrega:
response = requests.get("https://api-de-tu-moneda.com")
# ... procesa la respuesta
```

Archivo: `/app/frontend/src/components/CurrencyConverter.js`

```javascript
const currencies = [
  { code: 'MXN', label: 'Pesos MX', icon: '🇲🇽' },
  // ... añade más monedas
];
```

## 🎭 Personalizar el Hero

Archivo: `/app/frontend/src/components/Hero.js`

### Cambiar Gradiente de Fondo
```javascript
<section className="hero" style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}}>
```

### Agregar Video de Fondo
```javascript
<section className="hero">
  <video autoPlay loop muted className="hero-video">
    <source src="/videos/hero-bg.mp4" type="video/mp4" />
  </video>
  <div className="hero-content">
    {/* contenido */}
  </div>
</section>
```

## 🏷️ Agregar Más Categorías

Archivo: `/app/frontend/src/components/Categories.js`

```javascript
const categories = [
  {
    icon: '🎮',
    title: 'Consolas',
    description: 'PlayStation, Xbox, Nintendo Switch'
  },
  {
    icon: '📷',
    title: 'Cámaras',
    description: 'Canon, Nikon, Sony'
  },
  // ... más categorías
];
```

## 🔔 Agregar Notificaciones

### Instalar Biblioteca
```bash
cd /app/frontend
yarn add react-hot-toast
```

### Usar en Componentes
```javascript
import toast, { Toaster } from 'react-hot-toast';

// En tu componente:
<Toaster position="top-right" />

// Para mostrar notificación:
toast.success('Producto agregado!');
toast.error('Error al agregar producto');
```

## 🎨 Cambiar Fuente

Archivo: `/app/frontend/src/App.css`

```css
/* Opción 1: Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, sans-serif;
}

/* Opción 2: System Fonts */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## 🔍 Mejorar el SEO

Archivo: `/app/frontend/public/index.html`

```html
<head>
  <title>Mathi Phone - Tu Tienda Apple Premium</title>
  <meta name="description" content="Los mejores iPhones al mejor precio">
  <meta name="keywords" content="iphone, apple, celulares, tienda">
  
  <!-- Open Graph para redes sociales -->
  <meta property="og:title" content="Mathi Phone">
  <meta property="og:description" content="Tu tienda Apple premium">
  <meta property="og:image" content="https://tu-imagen.com/og-image.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Mathi Phone">
</head>
```

## 📊 Agregar Analytics

### Google Analytics
```html
<!-- En public/index.html antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Comandos Útiles

```bash
# Reiniciar todo
sudo supervisorctl restart all

# Ver logs en tiempo real
tail -f /var/log/supervisor/frontend.*.log
tail -f /var/log/supervisor/backend.*.log

# Limpiar base de datos
cd /app/backend
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb://localhost:27017').mathi_phone.products.delete_many({}))"

# Re-poblar productos
python seed_products.py
```

## 💡 Tips Importantes

1. **Siempre haz backup** antes de cambios grandes
2. **Prueba en local** antes de hacer cambios en producción
3. **Usa Git** para control de versiones
4. **Revisa los logs** si algo no funciona
5. **Las imágenes** de Apple pueden expirar, considera hospedar las tuyas

## 🆘 Problemas Comunes

### Frontend no compila
```bash
cd /app/frontend
yarn install
sudo supervisorctl restart frontend
```

### Backend no inicia
```bash
cd /app/backend
pip install -r requirements.txt
sudo supervisorctl restart backend
```

### MongoDB no conecta
```bash
sudo supervisorctl restart mongodb
```

---

**¿Necesitas ayuda?** Revisa los logs y el README principal para más información.
