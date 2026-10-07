import mongoose from "mongoose";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

// ✅ Updated Alibaba Cloud DashScope Embeddings Configuration
export const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-v4", // 1024 or 1536 dimensions
    dimensions: 1536,
    apiKey: ENV.DASHSCOPE_API_KEY || process.env.DASHSCOPE_API_KEY, // 👈 Explicit apiKey key
    configuration: {
        baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    },
    checkEmbeddingCtxLength: false, // Prevents tokenization errors with custom endpoints
});

async function embedExistingProducts() {
    // Debug step: Ensure key is actually loaded from ENV
    if (!ENV.DASHSCOPE_API_KEY && !process.env.DASHSCOPE_API_KEY) {
        console.error("❌ DASHSCOPE_API_KEY is missing in ENV or process.env!");
        process.exit(1);
    }

    await mongoose.connect(ENV.DB_URL);

    const products = await Product.find({ embedding: { $exists: false } });
    console.log(`Embedding ${products.length} products...`);

    for (const product of products) {
        // Combine product details into a rich semantic string
        const textToEmbed = `Product Name: ${product.name}. Category: ${product.category}. Description: ${product.description}. Price: $${product.price}`;

        const vector = await embeddings.embedQuery(textToEmbed);
        product.embedding = vector;
        await product.save();
    }

    console.log("Vector embedding generation complete.");
    process.exit(0);
}

embedExistingProducts();