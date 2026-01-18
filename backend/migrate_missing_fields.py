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
    
    # 1. Update missing category
    res1 = await products_collection.update_many(
        {"category": {"$exists": False}},
        {"$set": {"category": "iphone"}}
    )
    print(f"Updated category for {res1.modified_count} products.")

    # 2. Update missing price_currency
    res2 = await products_collection.update_many(
        {"price_currency": {"$exists": False}},
        {"$set": {"price_currency": "USD"}}
    )
    print(f"Updated price_currency for {res2.modified_count} products.")

    # 3. Update missing condition
    res3 = await products_collection.update_many(
        {"condition": {"$exists": False}},
        {"$set": {"condition": "excellent"}}
    )
    print(f"Updated condition for {res3.modified_count} products.")

    # 4. Update missing battery_health
    res4 = await products_collection.update_many(
        {"battery_health": {"$exists": False}},
        {"$set": {"battery_health": 100}}
    )
    print(f"Updated battery_health for {res4.modified_count} products.")
    
    print("Migration complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_missing_fields())
