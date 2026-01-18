// MongoDB Migration Script for Mathi Phone
// Run this in MongoDB Playground to set up production database

// Switch to your database
use('mathi_phone');

// Create products collection with indexes
db.createCollection('products');

// Create indexes for better performance
db.products.createIndex({ "id": 1 }, { unique: true });
db.products.createIndex({ "model": 1 });
db.products.createIndex({ "type": 1 });
db.products.createIndex({ "condition": 1 });
db.products.createIndex({ "price_ars": 1 });
db.products.createIndex({ "price_usd": 1 });
db.products.createIndex({ "available": 1 });

// Insert sample products (you can customize these)
db.products.insertMany([
  {
    "id": "iphone-16-pro-max-silver-256",
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
    "available": true,
    "warranty_months": 6,
    "description": "iPhone 16 Pro Max en color plateado con 90% de batería. Excelente estado, cámara profesional y chip A18 Pro de última generación.",
    "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-finish-select-202409-6-7inch-silver?wid=5120&hei=2880",
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "id": "iphone-15-pro-blue-512",
    "name": "iPhone 15 Pro",
    "model": "15",
    "type": "pro",
    "storage": "512GB",
    "color": "Azul Titani",
    "condition": "like-new",
    "battery_health": 95,
    "price_ars": 1200000,
    "price_usd": 1200,
    "screen_size": "6.1\" Super Retina XDR",
    "chip": "A17 Pro",
    "camera": "48MP Principal + 12MP Ultra Gran Angular + 12MP Teleobjetivo",
    "features": ["5G", "ProMotion 120Hz", "Dynamic Island", "USB-C", "Titanium"],
    "available": true,
    "warranty_months": 12,
    "description": "iPhone 15 Pro en azul titani con 95% de batería. Como nuevo, con garantía de 12 meses.",
    "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-blue?wid=5120&hei=2880",
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "id": "iphone-14-pink-128",
    "name": "iPhone 14",
    "model": "14",
    "type": "normal",
    "storage": "128GB",
    "color": "Rosa",
    "condition": "good",
    "battery_health": 85,
    "price_ars": 800000,
    "price_usd": 800,
    "screen_size": "6.1\" Super Retina XDR",
    "chip": "A15 Bionic",
    "camera": "12MP Principal + 12MP Ultra Gran Angular",
    "features": ["5G", "Ceramic Shield", "Night Mode", "Cinematic Mode"],
    "available": true,
    "warranty_months": 3,
    "description": "iPhone 14 en color rosa con 85% de batería. Buen estado general.",
    "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-pink?wid=5120&hei=2880",
    "created_at": new Date(),
    "updated_at": new Date()
  }
]);

// Verify insertion
console.log(`Products inserted: ${db.products.countDocuments()}`);

// Show first product
console.log("First product:", db.products.findOne());

// Create exchange_rates collection for currency converter
db.createCollection('exchange_rates');

// Insert initial exchange rates
db.exchange_rates.insertOne({
  "rates": {
    "USD": 1,
    "ARS": 1000,
    "USDT": 1,
    "BTC": 0.000016,
    "ETH": 0.0003
  },
  "last_updated": new Date(),
  "source": "manual"
});

console.log("Database setup complete!");
