export type UserRole = "farmer" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  avatar?: string;
  verified: boolean;
  joinDate: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  quality: "A+" | "A" | "B" | "C";
  category: string;
  description: string;
  imageUri?: string;
  blockchainVerified: boolean;
  txHash: string;
  listedAt: string;
  coordinates: { lat: number; lng: number };
}

export interface WasteListing {
  id: string;
  farmerId: string;
  farmerName: string;
  wasteType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  useCaseTags: string[];
  description: string;
  blockchainVerified: boolean;
  txHash: string;
  listedAt: string;
  coordinates: { lat: number; lng: number };
}

export interface Transaction {
  id: string;
  txHash: string;
  blockNumber: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  itemType: "crop" | "waste";
  itemName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  timestamp: string;
  status: "confirmed" | "pending";
  previousHash: string;
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Rajesh Kumar",
    email: "rajesh@farmer.com",
    role: "farmer",
    location: "Punjab, India",
    verified: true,
    joinDate: "2024-03-15",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya@buyer.com",
    role: "buyer",
    location: "Delhi, India",
    verified: true,
    joinDate: "2024-02-10",
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@agrilink.ai",
    role: "admin",
    location: "Bangalore, India",
    verified: true,
    joinDate: "2024-01-01",
  },
];

export const MOCK_CROPS: CropListing[] = [
  {
    id: "c1",
    farmerId: "u1",
    farmerName: "Rajesh Kumar",
    cropName: "Basmati Rice",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 85,
    location: "Punjab, India",
    quality: "A+",
    category: "Grains",
    description: "Premium long-grain basmati rice, freshly harvested",
    blockchainVerified: true,
    txHash: "0x7f3a9b2c4d8e1f0a5b6c7d8e9f0a1b2c",
    listedAt: "2026-03-28T10:00:00Z",
    coordinates: { lat: 30.7333, lng: 76.7794 },
  },
  {
    id: "c2",
    farmerId: "u4",
    farmerName: "Amit Patel",
    cropName: "Alphonso Mango",
    quantity: 200,
    unit: "kg",
    pricePerUnit: 180,
    location: "Maharashtra, India",
    quality: "A+",
    category: "Fruits",
    description: "Premium GI-certified Alphonso mangoes from Ratnagiri",
    blockchainVerified: true,
    txHash: "0x8a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    listedAt: "2026-03-27T08:00:00Z",
    coordinates: { lat: 17.1307, lng: 73.3083 },
  },
  {
    id: "c3",
    farmerId: "u5",
    farmerName: "Sunita Devi",
    cropName: "Wheat",
    quantity: 1000,
    unit: "kg",
    pricePerUnit: 35,
    location: "Haryana, India",
    quality: "A",
    category: "Grains",
    description: "High-quality wheat, ideal for flour production",
    blockchainVerified: false,
    txHash: "0x9b5c6d7e8f0a1b2c3d4e5f6a7b8c9d0e",
    listedAt: "2026-03-26T12:00:00Z",
    coordinates: { lat: 29.0588, lng: 76.0856 },
  },
  {
    id: "c4",
    farmerId: "u6",
    farmerName: "Mohan Reddy",
    cropName: "Tomatoes",
    quantity: 300,
    unit: "kg",
    pricePerUnit: 45,
    location: "Andhra Pradesh, India",
    quality: "A",
    category: "Vegetables",
    description: "Fresh red tomatoes, pesticide-free organic farming",
    blockchainVerified: true,
    txHash: "0xab2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
    listedAt: "2026-03-29T09:30:00Z",
    coordinates: { lat: 15.9129, lng: 79.74 },
  },
  {
    id: "c5",
    farmerId: "u7",
    farmerName: "Lakshmi Rao",
    cropName: "Sugarcane",
    quantity: 2000,
    unit: "kg",
    pricePerUnit: 3.5,
    location: "Tamil Nadu, India",
    quality: "B",
    category: "Cash Crops",
    description: "High-sucrose sugarcane variety",
    blockchainVerified: true,
    txHash: "0xcd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    listedAt: "2026-03-25T14:00:00Z",
    coordinates: { lat: 11.1271, lng: 78.6569 },
  },
  {
    id: "c6",
    farmerId: "u8",
    farmerName: "Vikram Singh",
    cropName: "Soybean",
    quantity: 750,
    unit: "kg",
    pricePerUnit: 62,
    location: "Madhya Pradesh, India",
    quality: "A",
    category: "Pulses",
    description: "Non-GMO soybean, high protein content",
    blockchainVerified: false,
    txHash: "0xef6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    listedAt: "2026-03-24T11:00:00Z",
    coordinates: { lat: 23.4733, lng: 77.947 },
  },
];

export const MOCK_WASTE: WasteListing[] = [
  {
    id: "w1",
    farmerId: "u1",
    farmerName: "Rajesh Kumar",
    wasteType: "Rice Stubble",
    quantity: 5000,
    unit: "kg",
    pricePerUnit: 0.5,
    location: "Punjab, India",
    useCaseTags: ["Biofuel", "Compost", "Cattle Feed"],
    description: "Dry rice stubble, ideal for biomass energy production. Prevents field burning.",
    blockchainVerified: true,
    txHash: "0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c",
    listedAt: "2026-03-28T11:00:00Z",
    coordinates: { lat: 30.7333, lng: 76.7794 },
  },
  {
    id: "w2",
    farmerId: "u5",
    farmerName: "Sunita Devi",
    wasteType: "Wheat Husk",
    quantity: 3000,
    unit: "kg",
    pricePerUnit: 0.8,
    location: "Haryana, India",
    useCaseTags: ["Animal Fodder", "Packaging", "Compost"],
    description: "Clean wheat husk, good for animal fodder and eco-packaging",
    blockchainVerified: true,
    txHash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    listedAt: "2026-03-27T09:00:00Z",
    coordinates: { lat: 29.0588, lng: 76.0856 },
  },
  {
    id: "w3",
    farmerId: "u7",
    farmerName: "Lakshmi Rao",
    wasteType: "Sugarcane Bagasse",
    quantity: 8000,
    unit: "kg",
    pricePerUnit: 1.2,
    location: "Tamil Nadu, India",
    useCaseTags: ["Biofuel", "Paper Production", "Building Material"],
    description: "Sugarcane bagasse for paper mills and biofuel plants",
    blockchainVerified: false,
    txHash: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
    listedAt: "2026-03-26T15:00:00Z",
    coordinates: { lat: 11.1271, lng: 78.6569 },
  },
  {
    id: "w4",
    farmerId: "u4",
    farmerName: "Amit Patel",
    wasteType: "Mango Seed Powder",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 8,
    location: "Maharashtra, India",
    useCaseTags: ["Cosmetics", "Food Processing", "Medicine"],
    description: "Mango seed kernel powder, valuable for cosmetics & health",
    blockchainVerified: true,
    txHash: "0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
    listedAt: "2026-03-25T10:00:00Z",
    coordinates: { lat: 17.1307, lng: 73.3083 },
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    txHash: "0xAA7f3a9b2c4d8e1f0a5b6c7d8e9f0a1b",
    blockNumber: 18492011,
    sellerId: "u1",
    sellerName: "Rajesh Kumar",
    buyerId: "u2",
    buyerName: "Priya Sharma",
    itemType: "crop",
    itemName: "Basmati Rice",
    quantity: 100,
    unit: "kg",
    totalAmount: 8500,
    timestamp: "2026-03-28T14:30:00Z",
    status: "confirmed",
    previousHash: "0x000000000000000000000000000000000000genesis",
  },
  {
    id: "tx2",
    txHash: "0xBB8a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    blockNumber: 18492012,
    sellerId: "u4",
    sellerName: "Amit Patel",
    buyerId: "u9",
    buyerName: "FreshMart Pvt Ltd",
    itemType: "crop",
    itemName: "Alphonso Mango",
    quantity: 50,
    unit: "kg",
    totalAmount: 9000,
    timestamp: "2026-03-28T16:00:00Z",
    status: "confirmed",
    previousHash: "0xAA7f3a9b2c4d8e1f0a5b6c7d8e9f0a1b",
  },
  {
    id: "tx3",
    txHash: "0xCC9b5c6d7e8f0a1b2c3d4e5f6a7b8c9d",
    blockNumber: 18492013,
    sellerId: "u1",
    sellerName: "Rajesh Kumar",
    buyerId: "u10",
    buyerName: "BioEnergy Corp",
    itemType: "waste",
    itemName: "Rice Stubble",
    quantity: 2000,
    unit: "kg",
    totalAmount: 1000,
    timestamp: "2026-03-29T09:15:00Z",
    status: "confirmed",
    previousHash: "0xBB8a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
  },
  {
    id: "tx4",
    txHash: "0xDDab2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    blockNumber: 18492014,
    sellerId: "u5",
    sellerName: "Sunita Devi",
    buyerId: "u11",
    buyerName: "AgriPack Solutions",
    itemType: "waste",
    itemName: "Wheat Husk",
    quantity: 1500,
    unit: "kg",
    totalAmount: 1200,
    timestamp: "2026-03-29T11:30:00Z",
    status: "pending",
    previousHash: "0xCC9b5c6d7e8f0a1b2c3d4e5f6a7b8c9d",
  },
  {
    id: "tx5",
    txHash: "0xEEcd4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    blockNumber: 18492015,
    sellerId: "u6",
    sellerName: "Mohan Reddy",
    buyerId: "u2",
    buyerName: "Priya Sharma",
    itemType: "crop",
    itemName: "Tomatoes",
    quantity: 150,
    unit: "kg",
    totalAmount: 6750,
    timestamp: "2026-03-29T13:00:00Z",
    status: "confirmed",
    previousHash: "0xDDab2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
  },
];

export const DISEASE_PREDICTIONS: Record<string, {
  disease: string;
  confidence: number;
  causes: string[];
  remedy: string[];
  prevention: string[];
}[]> = {
  "Rice": [
    {
      disease: "Rice Blast (Magnaporthe oryzae)",
      confidence: 87,
      causes: ["High humidity above 90%", "Nitrogen over-fertilization", "Warm temperatures 24-28°C", "Susceptible variety"],
      remedy: ["Apply Tricyclazole 75% WP @ 0.6g/L", "Spray Propiconazole 25% EC @ 1ml/L", "Remove and destroy infected tillers", "Drain field to reduce humidity"],
      prevention: ["Use resistant varieties (IR64, Jaya)", "Balanced nitrogen application", "Maintain field hygiene", "Early planting to avoid peak disease period"],
    },
    {
      disease: "Brown Plant Hopper (BPH) Infestation",
      confidence: 72,
      causes: ["High nitrogen levels", "Dense planting", "Warm humid conditions", "Broad-spectrum insecticide use killing natural enemies"],
      remedy: ["Buprofezin 25% SC @ 1.5ml/L", "Thiamethoxam 25% WG @ 0.3g/L", "Drain field briefly", "Avoid synthetic pyrethroids"],
      prevention: ["Resistant varieties", "Optimum plant spacing", "Avoid excessive nitrogen", "Conserve natural enemies"],
    },
  ],
  "Wheat": [
    {
      disease: "Yellow Rust (Stripe Rust)",
      confidence: 91,
      causes: ["Cool temperatures 10-15°C", "High humidity & dew", "Susceptible variety", "Wind-borne spore dispersal"],
      remedy: ["Propiconazole 25% EC @ 1ml/L", "Tebuconazole 25.9% EC @ 1ml/L", "Spray twice at 15-day interval", "Remove crop residue"],
      prevention: ["Rust-resistant varieties (HD 2781)", "Early sowing", "Balanced fertilizer use", "Monitor regularly during winter"],
    },
  ],
  "Tomato": [
    {
      disease: "Early Blight (Alternaria solani)",
      confidence: 89,
      causes: ["Warm humid weather", "Infected plant debris", "Mechanical injury", "Over-irrigation"],
      remedy: ["Mancozeb 75% WP @ 2.5g/L", "Chlorothalonil 75% WP @ 2g/L", "Remove infected leaves", "Improve air circulation"],
      prevention: ["Disease-free seeds", "Crop rotation", "Drip irrigation", "Avoid overhead watering"],
    },
  ],
  "Cotton": [
    {
      disease: "Cotton Bollworm (Helicoverpa armigera)",
      confidence: 85,
      causes: ["Hot dry weather", "Monsoonal gaps", "Lack of natural enemies", "Single crop cultivation"],
      remedy: ["Emamectin benzoate 5% SG @ 0.4g/L", "Spinosad 45% SC @ 0.3ml/L", "Release Trichogramma egg parasitoids", "Pheromone traps @ 5/acre"],
      prevention: ["Bt cotton varieties", "Intercropping with maize", "Regular monitoring", "Timely irrigation"],
    },
  ],
};

export const PRICE_PREDICTIONS: Record<string, Record<string, {
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: "rising" | "stable" | "falling";
  bestTime: string;
  bestMarket: string;
  demand: "high" | "medium" | "low";
  profitRange: string;
  reasoning: string;
}>> = {
  "Rice": {
    "Punjab": {
      predictedPrice: 88,
      minPrice: 80,
      maxPrice: 95,
      trend: "rising",
      bestTime: "November - January",
      bestMarket: "Amritsar APMC, Ludhiana Mandi",
      demand: "high",
      profitRange: "₹12,000 - ₹18,000 per acre",
      reasoning: "Basmati exports rising due to Middle East demand. MSP increases expected. Festival season driving domestic consumption.",
    },
    "Haryana": {
      predictedPrice: 82,
      minPrice: 75,
      maxPrice: 90,
      trend: "stable",
      bestTime: "October - December",
      bestMarket: "Karnal Mandi, Kurukshetra APMC",
      demand: "high",
      profitRange: "₹10,000 - ₹15,000 per acre",
      reasoning: "Good procurement by FCI. Stable demand from rice mills.",
    },
  },
  "Wheat": {
    "Punjab": {
      predictedPrice: 38,
      minPrice: 34,
      maxPrice: 42,
      trend: "rising",
      bestTime: "April - June",
      bestMarket: "Ludhiana APMC, Jalandhar Market",
      demand: "high",
      profitRange: "₹15,000 - ₹22,000 per acre",
      reasoning: "Government procurement at MSP ₹2,275/quintal. Flour mills increasing purchases. Export demand from neighboring countries.",
    },
  },
  "Tomato": {
    "Maharashtra": {
      predictedPrice: 52,
      minPrice: 30,
      maxPrice: 80,
      trend: "rising",
      bestTime: "December - February",
      bestMarket: "Vashi APMC, Pune Wholesale",
      demand: "high",
      profitRange: "₹2,00,000 - ₹4,00,000 per acre",
      reasoning: "Tomato prices highly volatile. Current supply shortage from AP, Telangana. Cold weather increasing quality.",
    },
  },
};

export const ADMIN_STATS = {
  totalUsers: 1284,
  totalFarmers: 856,
  totalBuyers: 392,
  totalAdmins: 36,
  totalTransactions: 4521,
  totalCropListings: 234,
  totalWasteListings: 187,
  flaggedListings: 12,
  totalRevenue: 45670000,
  wasteReused: 125000,
  pollutionPrevented: 75000,
  co2Saved: 850,
};
