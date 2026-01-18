"""
Servicio de tasas de cambio automáticas para Mathi Phone
Actualiza BTC, ETH, USDT, ARS automáticamente cada 5 minutos
"""
import asyncio
import logging
import requests
from datetime import datetime, timezone
from typing import Dict, Any
from mongodb_database import db

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExchangeRatesService:
    def __init__(self):
        self.update_interval = 300  # 5 minutos en segundos
        self.running = False
    
    async def fetch_crypto_rates(self) -> Dict[str, float]:
        """Obtener tasas de criptomonedas desde CoinGecko API"""
        try:
            response = requests.get(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
                timeout=10
            )
            data = response.json()
            
            return {
                "BTC": 1 / data.get('bitcoin', {}).get('usd', 50000),  # BTC en USD
                "ETH": 1 / data.get('ethereum', {}).get('usd', 3000),  # ETH en USD
                "USDT": data.get('tether', {}).get('usd', 1.0)        # USDT en USD
            }
        except Exception as e:
            logger.error(f"Error fetching crypto rates: {e}")
            return {
                "BTC": 1/50000,
                "ETH": 1/3000,
                "USDT": 1.0
            }
    
    async def fetch_ars_rate(self) -> float:
        """Obtener tasa ARS/USD desde ExchangeRate-API"""
        try:
            response = requests.get(
                "https://api.exchangerate-api.com/v4/latest/USD",
                timeout=10
            )
            data = response.json()
            return data['rates'].get('ARS', 1000.0)
        except Exception as e:
            logger.error(f"Error fetching ARS rate: {e}")
            return 1000.0
    
    async def update_exchange_rates(self) -> bool:
        """Actualizar tasas en la base de datos"""
        try:
            # Obtener tasas actuales
            crypto_rates = await self.fetch_crypto_rates()
            ars_rate = await self.fetch_ars_rate()
            
            # Combinar todas las tasas
            rates_data = {
                "USD": 1.0,
                "ARS": ars_rate,
                "USDT": crypto_rates["USDT"],
                "BTC": crypto_rates["BTC"],
                "ETH": crypto_rates["ETH"]
            }
            
            # Actualizar en MongoDB
            success = await db.update_exchange_rates(rates_data)
            
            if success:
                logger.info(f"✅ Precios estimados: BTC={rates_data['BTC']:.8f}, ETH={rates_data['ETH']:.6f}, ARS={rates_data['ARS']:.2f}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error updating exchange rates: {e}")
            return False
    
    async def start_auto_update(self):
        """Iniciar actualizaciones automáticas"""
        self.running = True
        logger.info("🔄 Iniciando servicio de tasas automáticas...")
        
        # Primera actualización inmediata
        await self.update_exchange_rates()
        
        # Bucle de actualizaciones periódicas
        while self.running:
            await asyncio.sleep(self.update_interval)
            if self.running:
                await self.update_exchange_rates()
    
    def stop(self):
        """Detener el servicio"""
        self.running = False
        logger.info("⏹️ Servicio de tasas automáticas detenido")

# Instancia global
exchange_service = ExchangeRatesService()

# Para ejecutar como script independiente
if __name__ == "__main__":
    async def main():
        # Conectar a la base de datos
        await db.connect()
        
        # Iniciar servicio
        await exchange_service.start_auto_update()
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        exchange_service.stop()
        print("\n👋 Servicio detenido por el usuario")
