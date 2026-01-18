"""
Base de datos simulada en memoria para Mathi Phone
"""
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any

class MockDatabase:
    def __init__(self):
        self.products = []
        self._initialize_products()
    
    def _initialize_products(self):
        """Productos iniciales"""
        self.products = [
            {
                "id": str(uuid.uuid4()),
                "name": "iPhone 16 Pro Max",
                "model": "16",
                "type": "pro-max",
                "storage": "256GB",
                "color": "Plateado",
                "condition": "excellent",
                "battery_health": 90,
                "price_ars": 1500000,
                "price_usd": 1500,
                "screen_size": "6.7\" Super Retina XDR",
                "chip": "A18 Pro",
                "camera": "48MP Principal + 12MP Ultra Gran Angular + 12MP Teleobjetivo",
                "features": ["5G", "ProMotion 120Hz", "Dynamic Island", "Action Button", "Titanium"],
                "available": True,
                "warranty_months": 6,
                "description": "iPhone 16 Pro Max en color plateado con 90% de batería. Excelente estado, cámara profesional y chip A18 Pro de última generación.",
                "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-finish-select-202409-6-7inch-silver?wid=5120&hei=2880",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
    
    def get_products(self) -> List[Dict[str, Any]]:
        """Obtener todos los productos"""
        return self.products.copy()
    
    def get_product(self, product_id: str) -> Dict[str, Any]:
        """Obtener un producto por ID"""
        for product in self.products:
            if product["id"] == product_id:
                return product.copy()
        return None
    
    def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crear un nuevo producto"""
        new_product = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            **product_data
        }
        self.products.append(new_product)
        return new_product.copy()
    
    def update_product(self, product_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Actualizar un producto"""
        for i, product in enumerate(self.products):
            if product["id"] == product_id:
                self.products[i].update(update_data)
                self.products[i]["updated_at"] = datetime.now(timezone.utc).isoformat()
                return self.products[i].copy()
        return None
    
    def delete_product(self, product_id: str) -> bool:
        """Eliminar un producto"""
        for i, product in enumerate(self.products):
            if product["id"] == product_id:
                del self.products[i]
                return True
        return False

# Instancia global de la base de datos
db = MockDatabase()
