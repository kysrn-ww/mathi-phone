#!/bin/bash
set -e

# Script de build para producción en Render
echo "🚀 Iniciando build para producción..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
pip install -r requirements.txt

# Construir frontend
echo "🏗️ Construyendo frontend..."
cd frontend
npm install --legacy-peer-deps
export CI=false
npm run build
cd ..

echo "✅ Build completado!"
echo "📁 Estructura de archivos:"
ls -la

# Verificar que el build del frontend exista
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build encontrado"
    ls -la frontend/build/
else
    echo "❌ Error: Frontend build no encontrado"
    exit 1
fi
