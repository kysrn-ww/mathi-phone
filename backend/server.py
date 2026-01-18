from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import asyncio
import requests
from mongodb_database import db
from exchange_rates_service import exchange_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
print("🔄 Connecting to MongoDB...")
client = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Initialize database connection and start exchange rate service"""
    await db.connect()
    # Iniciar servicio de tasas automáticas en background
    asyncio.create_task(exchange_service.start_auto_update())

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection and stop exchange rate service"""
    exchange_service.stop()
    await db.disconnect()


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    model: str  # 11, 12, 13, 14, 15, 16, 17, se
    type: str  # pro-max, pro, plus, normal, mini, se
    storage: str  # 64GB, 128GB, 256GB, 512GB, 1TB
    color: str
    condition: str  # sealed, like-new, excellent, good
    battery_health: int  # 0-100
    price_ars: float
    price_usd: float
    screen_size: str
    chip: str
    camera: str
    features: List[str]
    available: bool = True
    warranty_months: int = 0
    description: str = ""
    image_url: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
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


# Exchange Rate Models
class ExchangeRates(BaseModel):
    usd: float = 1.0
    ars: float
    usdt: float = 1.0
    btc: float
    eth: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "Mathi Phone API - Tu tienda Apple premium"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Product Routes
@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    product_data = product.model_dump()
    product_data['created_at'] = datetime.now(timezone.utc)
    product_data['updated_at'] = datetime.now(timezone.utc)
    
    # Usar base de datos simulada
    new_product = await db.create_product(product_data)
    return Product(**new_product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    """Update a product"""
    print(f"Updating product {product_id} with data: {product_update.model_dump()}")
    
    # Usar base de datos simulada
    update_data = product_update.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc)
    
    updated_product = await db.update_product(product_id, update_data)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    try:
        print(f"Attempting to delete product with ID: {product_id}")
        
        # Usar base de datos simulada
        success = await db.delete_product(product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found")
        
        result = {"message": f"Product {product_id} deleted successfully"}
        print(f"Returning result: {result}")
        return result
    except Exception as e:
        print(f"Error in delete_product: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@api_router.get("/products", response_model=List[Product])
async def get_products(
    model: Optional[str] = Query(None, description="Filter by model: 11, 12, 13, 14, 15, 16, 17, se"),
    type: Optional[str] = Query(None, description="Filter by type: pro-max, pro, plus, normal, mini, se"),
    condition: Optional[str] = Query(None, description="Filter by condition: sealed, like-new, excellent, good"),
    min_battery: Optional[int] = Query(None, ge=0, le=100, description="Minimum battery health"),
    max_price_ars: Optional[float] = Query(None, ge=0, description="Maximum price in ARS"),
    max_price_usd: Optional[float] = Query(None, ge=0, description="Maximum price in USD"),
    available: Optional[bool] = Query(None, description="Filter by availability"),
    search: Optional[str] = Query(None, description="Search in name, color, chip, features"),
    limit: int = Query(50, ge=1, le=100, description="Number of products to return"),
    offset: int = Query(0, ge=0, description="Number of products to skip")
):
    """Get all products with optional filtering"""
    
    # Usar base de datos simulada
    products = await db.get_products()
    
    # Apply filters
    if model:
        products = [p for p in products if p.get('model') == model]
    if type:
        products = [p for p in products if p.get('type') == type]
    if condition:
        products = [p for p in products if p.get('condition') == condition]
    if min_battery is not None:
        products = [p for p in products if p.get('battery_health', 0) >= min_battery]
    if max_price_ars is not None:
        products = [p for p in products if p.get('price_ars', float('inf')) <= max_price_ars]
    if max_price_usd is not None:
        products = [p for p in products if p.get('price_usd', float('inf')) <= max_price_usd]
    if available is not None:
        products = [p for p in products if p.get('available') == available]
    if search:
        search_lower = search.lower()
        products = [p for p in products if 
                   search_lower in p.get('name', '').lower() or
                   search_lower in p.get('color', '').lower() or
                   search_lower in p.get('chip', '').lower() or
                   any(search_lower in feature.lower() for feature in p.get('features', []))]
    
    # Apply pagination
    total = len(products)
    products = products[offset:offset + limit]
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    
    # Usar base de datos simulada
    product = await db.get_product(product_id)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product_duplicate(product_id: str, product_update: ProductUpdate):
    """Update a product - DUPLICATE FUNCTION - IGNORE"""
    pass

@api_router.delete("/products/{product_id}")
async def delete_product_duplicate(product_id: str):
    """Delete a product - DUPLICATE FUNCTION - IGNORE"""
    pass


# Exchange Rates Route
@api_router.get("/exchange-rates", response_model=ExchangeRates)
async def get_exchange_rates():
    """Get current exchange rates from MongoDB database"""
    try:
        # Obtener tasas desde MongoDB
        rates_data = await db.get_exchange_rates()
        
        if rates_data and 'rates' in rates_data:
            rates = rates_data['rates']
            return ExchangeRates(
                usd=rates.get('USD', 1.0),
                ars=rates.get('ARS', 1000.0),
                usdt=rates.get('USDT', 1.0),
                btc=rates.get('BTC', 1/50000),
                eth=rates.get('ETH', 1/3000)
            )
        
        # Si no hay datos, retornar tasas por defecto
        return ExchangeRates(
            usd=1.0,
            ars=1000.0,
            usdt=1.0,
            btc=1/50000,
            eth=1/3000
        )
        
    except Exception as e:
        logger.error(f"Error fetching exchange rates: {e}")
        # Return fallback rates
        return ExchangeRates(
            usd=1.0,
            ars=1000.0,
            usdt=1.0,
            btc=1/50000,
            eth=1/3000
        )


# Add CORS middleware BEFORE routes
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8001", 
        "https://tienda.onrender.com",
        "https://tienda-api.onrender.com"
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed to DEBUG to see more details
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint - servir el frontend
@app.get("/", include_in_schema=False)
async def serve_root():
    """Serve the React frontend at root"""
    frontend_build = Path(__file__).parent.parent / "frontend" / "build"
    index_file = frontend_build / "index.html"
    
    if index_file.exists():
        return FileResponse(index_file)
    
    # Si no existe el build, servir un HTML simple
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tienda - Frontend no construido</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
            .info { color: #3498db; }
        </style>
    </head>
    <body>
        <h1 class="error">Frontend no construido</h1>
        <p class="info">Por favor, ejecuta <code>npm run build</code> en la carpeta frontend</p>
        <p>O inicia el frontend por separado en <a href="http://localhost:3000">http://localhost:3000</a></p>
    </body>
    </html>
    """)

@app.get("/api/info")
async def root():
    return {"message": "Tienda API is running!", "version": "1.0.0"}

@app.get("/docs")
async def docs():
    return {"message": "FastAPI docs available at /docs"}

# Montar archivos estáticos del frontend
frontend_path = Path(__file__).parent.parent / "frontend" / "build"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=frontend_path / "static"), name="static")

@app.get("/api", include_in_schema=False)
async def read_api():
    return {"message": "API endpoints available at /api/"}

# Ruta catch-all para servir el frontend (React Router) - solo para rutas que no son /api
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str):
    """Serve the React frontend for non-API routes"""
    # Si la ruta empieza con /api, no procesarla aquí
    if full_path.startswith('api/'):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    frontend_build = Path(__file__).parent.parent / "frontend" / "build"
    index_file = frontend_build / "index.html"
    
    if index_file.exists():
        return FileResponse(index_file)
    
    # Si no existe el build, servir un HTML simple
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tienda - Frontend no construido</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
            .info { color: #3498db; }
        </style>
    </head>
    <body>
        <h1 class="error">Frontend no construido</h1>
        <p class="info">Por favor, ejecuta <code>npm run build</code> en la carpeta frontend</p>
        <p>O inicia el frontend por separado en <a href="http://localhost:3000">http://localhost:3000</a></p>
    </body>
    </html>
    """)

@app.on_event("shutdown")
async def shutdown_db_client():
    if db is not None:
        try:
            client.close()
        except:
            pass