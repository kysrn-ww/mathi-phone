"""
Script de configuración para MongoDB Mathi Phone
Instala dependencias, configura la base de datos e inicia el servicio
"""
import asyncio
import subprocess
import sys
from pathlib import Path

async def setup():
    print("🚀 Configurando Mathi Phone con MongoDB...")
    
    # 1. Instalar dependencias
    print("📦 Instalando dependencias...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "motor", "pymongo", "requests", "python-dotenv"])
        print("✅ Dependencias instaladas")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias: {e}")
        return
    
    # 2. Conectar a la base de datos
    print("🔗 Conectando a MongoDB...")
    from mongodb_database import db
    
    try:
        await db.connect()
        print("✅ Conectado a MongoDB")
    except Exception as e:
        print(f"❌ Error conectando a MongoDB: {e}")
        print("💡 Asegúrate de que MongoDB esté instalado y corriendo")
        print("   Descárgalo desde: https://www.mongodb.com/try/download/community")
        return
    
    # 3. Inicializar tasas de cambio
    print("💰 Inicializando tasas de cambio...")
    from exchange_rates_service import exchange_service
    
    success = await exchange_service.update_exchange_rates()
    if success:
        print("✅ Tasas de cambio actualizadas")
    else:
        print("❌ Error actualizando tasas de cambio")
    
    # 4. Desconectar
    await db.disconnect()
    print("🎉 Configuración completada!")
    
    print("\n📋 Próximos pasos:")
    print("1. Inicia MongoDB: mongod")
    print("2. Inicia el servidor: uvicorn server:app --reload")
    print("3. Abre http://localhost:8000/docs para ver la API")
    print("4. Las tasas se actualizarán automáticamente cada 5 minutos")

if __name__ == "__main__":
    asyncio.run(setup())
