import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def migrate_categories():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'mathi_phone')
    
    print(f"Connecting to {mongo_url}...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    products_collection = db.products
    
    # Update all products that don't have a category field
    result = await products_collection.update_many(
        {"category": {"$exists": False}},
        {"$set": {"category": "iphone"}}
    )
    
    print(f"Migration complete. Updated {result.modified_count} products.")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_categories())
