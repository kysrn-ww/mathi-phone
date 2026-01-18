from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uuid
import json
import os
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

# File-based persistence
DATA_FILE = "products_data.json"
UPLOAD_DIR = "uploads"

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_products():
    """Load products from JSON file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Convert string dates back to datetime objects
                for product in data:
                    product['created_at'] = datetime.fromisoformat(product['created_at'])
                    product['updated_at'] = datetime.fromisoformat(product['updated_at'])
                return data
        except Exception as e:
            print(f"Error loading products: {e}")
    return []

def save_products():
    """Save products to JSON file"""
    try:
        # Convert datetime objects to strings for JSON serialization
        products_data = []
        for product in products_db:
            product_dict = product.model_dump()
            product_dict['created_at'] = product.created_at.isoformat()
            product_dict['updated_at'] = product.updated_at.isoformat()
            products_data.append(product_dict)
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(products_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving products: {e}")
        return False

# In-memory database
products_db = []

# Load existing products
products_db = load_products()

# If no products exist, create initial product
if not products_db:
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
    save_products()

# Create FastAPI app
app = FastAPI()

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Permitir todos los orígenes para ngrok
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
        # Handle both dict and Product objects
        current_product_id = product.id if hasattr(product, 'id') else product.get('id')
        if current_product_id == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

# Upload image endpoint
@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Check file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Return the URL
        image_url = f"http://localhost:8001/uploads/{unique_filename}"
        return {"image_url": image_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

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
    save_products()  # Auto-save
    return new_product

# Update product
@app.put("/api/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    for i, product in enumerate(products_db):
        # Handle both dict and Product objects
        current_product_id = product.id if hasattr(product, 'id') else product.get('id')
        if current_product_id == product_id:
            update_data = product_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if hasattr(product, key):
                    setattr(products_db[i], key, value)
                else:
                    products_db[i][key] = value
            # Update timestamp
            if hasattr(products_db[i], 'updated_at'):
                products_db[i].updated_at = datetime.now(timezone.utc)
            else:
                products_db[i]['updated_at'] = datetime.now(timezone.utc)
            save_products()  # Auto-save
            return products_db[i]
    raise HTTPException(status_code=404, detail="Product not found")

# Delete product
@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    for i, product in enumerate(products_db):
        # Handle both dict and Product objects
        current_product_id = product.id if hasattr(product, 'id') else product.get('id')
        if current_product_id == product_id:
            del products_db[i]
            save_products()  # Auto-save
            return {"message": f"Product {product_id} deleted successfully"}
    raise HTTPException(status_code=404, detail="Product not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
