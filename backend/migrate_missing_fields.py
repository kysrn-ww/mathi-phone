import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def migrate_missing_fields():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'mathi_phone')
    
    print(f"Connecting to {mongo_url}...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    products_collection = db.products
    
    # Update products missing 'condition'
    res1 = await products_collection.update_many(
        {"condition": {"$exists": False}},
        {"$set": {"condition": "sealed"}}
    )
    
    # Update products missing 'battery_health'
    res2 = await products_collection.update_many(
        {"battery_health": {"$exists": False}},
        {"$set": {"battery_health": 100}}
    )
    
    print(f"Migration complete.")
    print(f"Updated {res1.modified_count} products missing 'condition'.")
    print(f"Updated {res2.modified_count} products missing 'battery_health'.")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_missing_fields())
