import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";

const additionalProducts = [
    {
        name: "4K Ultra HD Action Camera",
        description:
            "Waterproof action camera with image stabilization, dual screens, and 4K recording at 60fps. Includes mounting accessories for all sports.",
        price: 199.99,
        stock: 40,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 310,
    },
    {
        name: "Minimalist Ergonomic Desk Chair",
        description:
            "Breathable mesh office chair with adjustable lumbar support, 3D armrests, and smooth-rolling casters. Ideal for long work sessions.",
        price: 219.99,
        stock: 20,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=500",
            "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",
        ],
        averageRating: 4.5,
        totalReviews: 184,
    },
    {
        name: "Wireless Charging Pad",
        description:
            "Fast-charging 15W Qi-certified wireless pad with ultra-slim aluminum body and anti-slip silicone surface.",
        price: 29.99,
        stock: 85,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1622445268465-84024680922c?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
        ],
        averageRating: 4.3,
        totalReviews: 512,
    },
    {
        name: "Ergonomic Vertical Mouse",
        description:
            "Wireless vertical mouse designed to reduce forearm strain and wrist pressure. Features adjustable DPI and silent clicks.",
        price: 45.99,
        stock: 65,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
        ],
        averageRating: 4.4,
        totalReviews: 228,
    },
    {
        name: "Noise-Canceling USB Microphone",
        description:
            "Studio-quality condenser microphone with cardioid pickup pattern, gain control, and zero-latency monitoring for streaming and podcasts.",
        price: 99.99,
        stock: 50,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
        ],
        averageRating: 4.8,
        totalReviews: 389,
    },
    {
        name: "Polarized Aviator Sunglasses",
        description:
            "Classic metal frame sunglasses with UV400 protection and glare-reducing polarized lenses. Includes protective hardshell case.",
        price: 55.00,
        stock: 60,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        ],
        averageRating: 4.5,
        totalReviews: 176,
    },
    {
        name: "Minimalist Slim Leather Wallet",
        description:
            "RFID-blocking front pocket wallet crafted from top-grain leather. Holds up to 8 cards plus cash without bulk.",
        price: 34.99,
        stock: 90,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
            "https://images.unsplash.com/photo-1606503830010-81f7d24f0c43?w=500",
        ],
        averageRating: 4.7,
        totalReviews: 620,
    },
    {
        name: "Chunky Knit Oversized Sweater",
        description:
            "Cozy pullover sweater made from soft wool blend yarn. Features a relaxed silhouette and ribbed cuffs for cool weather.",
        price: 74.99,
        stock: 35,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
        ],
        averageRating: 4.4,
        totalReviews: 112,
    },
    {
        name: "Canvas Minimalist Sneakers",
        description:
            "Versatile low-top canvas sneakers with durable rubber soles and cushioned insoles for all-day comfort.",
        price: 59.99,
        stock: 70,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
        ],
        averageRating: 4.2,
        totalReviews: 205,
    },
    {
        name: "Waterproof Trench Coat",
        description:
            "Modern double-breasted trench coat featuring a removable belt, deep pockets, and wind-resistant outer shell.",
        price: 139.99,
        stock: 20,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=500",
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 98,
    },
    {
        name: "Insulated Stainless Steel Water Bottle",
        description:
            "32oz double-wall vacuum insulated flask that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof straw lid.",
        price: 29.99,
        stock: 120,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
            "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=500",
        ],
        averageRating: 4.9,
        totalReviews: 840,
    },
    {
        name: "Adjustable Dumbbell Set",
        description:
            "Space-saving dumbbell system adjustable from 5 to 52.5 lbs with a simple dial mechanism. Ideal for home workouts.",
        price: 199.99,
        stock: 15,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        ],
        averageRating: 4.8,
        totalReviews: 432,
    },
    {
        name: "Resistance Bands Set",
        description:
            "Set of 5 color-coded exercise bands ranging from light to extra-heavy resistance. Includes door anchor and handles.",
        price: 22.99,
        stock: 110,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
        ],
        averageRating: 4.5,
        totalReviews: 290,
    },
    {
        name: "Trail Running Backpack",
        description:
            "Lightweight 15L hydration pack with a 2L water bladder, reflective accents, and breathable shoulder straps.",
        price: 64.99,
        stock: 40,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 154,
    },
    {
        name: "Deep Tissue Massage Gun",
        description:
            "Percussive therapy device with 6 speed settings and 4 interchangeable heads for muscle relief and recovery.",
        price: 89.99,
        stock: 50,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500",
            "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500",
        ],
        averageRating: 4.7,
        totalReviews: 512,
    },
    {
        name: "Sci-Fi Epic Hardcover",
        description:
            "An award-winning space opera exploring distant galaxies, artificial intelligence, and political intrigue.",
        price: 28.99,
        stock: 65,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
        ],
        averageRating: 4.8,
        totalReviews: 678,
    },
    {
        name: "Modern Home Cookbook",
        description:
            "Over 100 quick and delicious recipes designed for busy weeknights, complete with full-color photography.",
        price: 32.50,
        stock: 80,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500",
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        ],
        averageRating: 4.7,
        totalReviews: 345,
    },
    {
        name: "Self-Improvement Guide",
        description:
            "Practical habits and mental frameworks to boost productivity, build resilience, and achieve long-term goals.",
        price: 18.99,
        stock: 100,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 920,
    },
    {
        name: "World History Atlas",
        description:
            "Comprehensive visual history guide featuring detailed maps, timelines, and essays covering global civilizations.",
        price: 45.00,
        stock: 30,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
            "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500",
        ],
        averageRating: 4.9,
        totalReviews: 180,
    },
    {
        name: "Fantasy Novel Collector's Edition",
        description:
            "Hardbound edition with gold foil stamping, custom endpapers, and exclusive author illustrations.",
        price: 34.99,
        stock: 45,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
        ],
        averageRating: 5.0,
        totalReviews: 410,
    },
];

const seedDatabase = async () => {
    try {
        if (process.env.NODE_ENV === "production") {
            console.error("❌ Refusing to run seed script against production (NODE_ENV=production)");
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(ENV.DB_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing products
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        // Insert seed products
        await Product.insertMany(additionalProducts);
        console.log(`✅ Successfully seeded ${additionalProducts.length} products`);

        // Display summary
        const categories = [...new Set(additionalProducts.map((p) => p.category))];
        console.log("\n📊 Seeded Products Summary:");
        console.log(`Total Products: ${additionalProducts.length}`);
        console.log(`Categories: ${categories.join(", ")}`);

        // Close connection
        await mongoose.connection.close();
        console.log("\n✅ Database seeding completed and connection closed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();