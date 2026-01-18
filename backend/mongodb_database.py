"""
Base de datos MongoDB real para Mathi Phone
"""
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv
from pathlib import Path

# Cargar variables de entorno
ROOT_DIR = Path(".")
load_dotenv(ROOT_DIR / '.env')

class MongoDBDatabase:
    def __init__(self):
        self.client = None
        self.db = None
        self.products_collection = None
        self.exchange_rates_collection = None
        self.status_checks_collection = None
    
    async def connect(self):
        """Conectar a MongoDB"""
        try:
            mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
            db_name = os.environ.get('DB_NAME', 'mathi_phone')
            
            self.client = AsyncIOMotorClient(mongo_url)
            self.db = self.client[db_name]
            self.products_collection = self.db.products
            self.exchange_rates_collection = self.db.exchange_rates
            self.status_checks_collection = self.db.status_checks
            
            # Test connection
            await self.client.admin.command('ping')
            print(f"✅ Connected to MongoDB at {mongo_url}")
            
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise
    
    async def disconnect(self):
        """Desconectar de MongoDB"""
        if self.client:
            self.client.close()
    
    async def get_products(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Obtener todos los productos con filtros opcionales"""
        try:
            query = {}
            if filters:
                if filters.get('category'):
                    query['category'] = filters['category']
                if filters.get('model'):
                    query['model'] = filters['model']
                if filters.get('type'):
                    query['type'] = filters['type']
                if filters.get('condition'):
                    query['condition'] = filters['condition']
                if filters.get('min_battery'):
                    query['battery_health'] = {'$gte': filters['min_battery']}
                if filters.get('max_price_ars'):
                    query['price_ars'] = {'$lte': filters['max_price_ars']}
                if filters.get('max_price_usd'):
                    query['price_usd'] = {'$lte': filters['max_price_usd']}
                if filters.get('available') is not None:
                    query['available'] = filters['available']
                if filters.get('search'):
                    search_term = filters['search'].lower()
                    query['$or'] = [
                        {'name': {'$regex': search_term, '$options': 'i'}},
                        {'color': {'$regex': search_term, '$options': 'i'}},
                        {'chip': {'$regex': search_term, '$options': 'i'}},
                        {'description': {'$regex': search_term, '$options': 'i'}}
                    ]
            
            cursor = self.products_collection.find(query)
            products = []
            async for product in cursor:
                # Convert ObjectId to string for JSON serialization
                if '_id' in product:
                    product['_id'] = str(product['_id'])
                products.append(product)
            
            return products
            
        except Exception as e:
            print(f"❌ Error getting products: {e}")
            return []
    
    async def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Obtener un producto por ID"""
        try:
            product = await self.products_collection.find_one({'id': product_id})
            if product:
                if '_id' in product:
                    product['_id'] = str(product['_id'])
                return product
            return None
            
        except Exception as e:
            print(f"❌ Error getting product {product_id}: {e}")
            return None
    
    async def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crear un nuevo producto"""
        try:
            new_product = {
                "id": product_data.get('id', f"product_{datetime.now().timestamp()}"),
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                **product_data
            }
            
            result = await self.products_collection.insert_one(new_product)
            if result.inserted_id:
                if '_id' in new_product:
                    new_product['_id'] = str(new_product['_id'])
                return new_product
            
            return None
            
        except DuplicateKeyError:
            print(f"❌ Product with ID {product_data.get('id')} already exists")
            return None
        except Exception as e:
            print(f"❌ Error creating product: {e}")
            return None
    
    async def update_product(self, product_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualizar un producto"""
        try:
            update_data['updated_at'] = datetime.now(timezone.utc)
            
            result = await self.products_collection.update_one(
                {'id': product_id},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                updated_product = await self.get_product(product_id)
                return updated_product
            
            return None
            
        except Exception as e:
            print(f"❌ Error updating product {product_id}: {e}")
            return None
    
    async def delete_product(self, product_id: str) -> bool:
        """Eliminar un producto"""
        try:
            result = await self.products_collection.delete_one({'id': product_id})
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"❌ Error deleting product {product_id}: {e}")
            return False
    
    async def get_exchange_rates(self) -> Optional[Dict[str, Any]]:
        """Obtener tasas de cambio actuales"""
        try:
            rates = await self.exchange_rates_collection.find_one()
            if rates:
                if '_id' in rates:
                    rates['_id'] = str(rates['_id'])
                return rates
            return None
            
        except Exception as e:
            print(f"❌ Error getting exchange rates: {e}")
            return None
    
    async def update_exchange_rates(self, rates_data: Dict[str, Any]) -> bool:
        """Actualizar tasas de cambio"""
        try:
            update_data = {
                'rates': rates_data,
                'last_updated': datetime.now(timezone.utc),
                'source': 'api'
            }
            
            result = await self.exchange_rates_collection.update_one(
                {},
                {'$set': update_data},
                upsert=True
            )
            
            return result.acknowledged
            
        except Exception as e:
            print(f"❌ Error updating exchange rates: {e}")
            return False
    
    @property
    def status_checks(self):
        """Propiedad para compatibilidad con código existente"""
        return self.status_checks_collection

# Instancia global de la base de datos
db = MongoDBDatabase()
