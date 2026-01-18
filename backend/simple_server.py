from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Simple data models
class Product(BaseModel):
    id: str
    name: str
    model: str
    type: str
    storage: str
    color: str
    condition: str
    battery_health: int
    price_ars: float
    price_usd: float
    screen_size: str
    chip: str
    camera: str
    features: List[str]
    available: bool
    warranty_months: int
    description: str
    image_url: str
    created_at: datetime
    updated_at: datetime

class ProductCreate(BaseModel):
    name: str = ""
    model: str = ""
    type: str = ""
    storage: str = ""
    color: str = ""
    condition: str = ""
    battery_health: int = 0
    price_ars: float = 0
    price_usd: float = 0
    screen_size: str = ""
    chip: str = ""
    camera: str = ""
    features: List[str] = []
    available: bool = True
    warranty_months: int = 0
    description: str = ""
    image_url: str = ""

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    type: Optional[str] = None
    storage: Optional[str] = None
    color: Optional[str] = None
    condition: Optional[str] = None
    battery_health: Optional[int] = None
    price_ars: Optional[float] = None
    price_usd: Optional[float] = None
    screen_size: Optional[str] = None
    chip: Optional[str] = None
    camera: Optional[str] = None
    features: Optional[List[str]] = None
    available: Optional[bool] = None
    warranty_months: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

# In-memory database
products_db = []

# Initialize with one product
initial_product = Product(
    id=str(uuid.uuid4()),
    name="iPhone 16 Pro Max",
    model="16",
    type="pro-max",
    storage="256GB",
    color="Plateado",
    condition="excellent",
    battery_health=90,
    price_ars=1500000,
    price_usd=1500,
    screen_size="6.7\" Super Retina XDR",
    chip="A18 Pro",
    camera="48MP Principal + 12MP Ultra Gran Angular + 12MP Teleobjetivo",
    features=["5G", "ProMotion 120Hz", "Dynamic Island", "Action Button", "Titanium"],
    available=True,
    warranty_months=6,
    description="iPhone 16 Pro Max en color plateado con 90% de batería. Excelente estado, cámara profesional y chip A18 Pro de última generación.",
    image_url="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-finish-select-202409-6-7inch-silver?wid=5120&hei=2880",
    created_at=datetime.now(timezone.utc),
    updated_at=datetime.now(timezone.utc)
)
products_db.append(initial_product)

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Mathi Phone API is running!", "version": "1.0.0"}

# Get all products
@app.get("/api/products", response_model=List[Product])
async def get_products():
    return products_db

# Get product by ID
@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    for product in products_db:
        if product.id == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

# Create product
@app.post("/api/products", response_model=Product)
async def create_product(product: ProductCreate):
    new_product = Product(
        id=str(uuid.uuid4()),
        **product.model_dump(),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    products_db.append(new_product)
    return new_product

# Update product
@app.put("/api/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    for i, product in enumerate(products_db):
        if product.id == product_id:
            update_data = product_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(products_db[i], key, value)
            products_db[i].updated_at = datetime.now(timezone.utc)
            return products_db[i]
    raise HTTPException(status_code=404, detail="Product not found")

# Delete product
@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    for i, product in enumerate(products_db):
        if product.id == product_id:
            del products_db[i]
            return {"message": f"Product {product_id} deleted successfully"}
    raise HTTPException(status_code=404, detail="Product not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
