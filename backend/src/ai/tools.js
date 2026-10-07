import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import mongoose from "mongoose";
import { ENV } from "../config/env.js"
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

// Initialize OpenAI Embeddings Model
// const embeddings = new OpenAIEmbeddings({
//   modelName: "text-embedding-3-small",
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });

// Alibaba Cloud DashScope Text Embeddings
export const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-v4", // 1024 / 1536 dimensions
    dimensions: 1536,
    apiKey: ENV.DASHSCOPE_API_KEY || process.env.DASHSCOPE_API_KEY,
    configuration: {
        baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    },
    checkEmbeddingCtxLength: false, // Recommended for non-OpenAI endpoint wrappers
});

// Tool 1: Mathematical Vector Search Tool (Semantic Similarity & Comparisons)
export const semanticProductSearchTool = tool(
    async ({ query, limit = 5, categoryFilter }) => {
        const collection = mongoose.connection.db.collection("products");

        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection,
            indexName: "vector_index_products", // Must match Atlas index name
            textKey: "description",
            embeddingKey: "embedding",
        });

        // Run cosine similarity search over vector embeddings
        const filter = categoryFilter ? { preFilter: { category: { $eq: categoryFilter } } } : {};
        const results = await vectorStore.similaritySearchWithScore(query, limit, filter);

        const formatted = results.map(([doc, score]) => ({
            id: doc.metadata._id,
            name: doc.metadata.name,
            description: doc.pageContent,
            price: doc.metadata.price,
            category: doc.metadata.category,
            stock: doc.metadata.stock,
            averageRating: doc.metadata.averageRating,
            similarityScore: score.toFixed(4), // Cosine proximity score
        }));

        return JSON.stringify(formatted);
    },
    {
        name: "semantic_product_search",
        description:
            "Search and mathematically compare products based on natural language queries, visual/functional attributes, or semantic feature similarity.",
        schema: z.object({
            query: z.string().describe("The user query or product feature description to search and compare."),
            limit: z.number().optional().default(5).describe("Maximum number of similar products to return."),
            categoryFilter: z.string().optional().describe("Filter results by exact category string."),
        }),
    }
);

// Tool 2: Order Lookup Tool (Professional CS Feature)
export const getUserOrdersTool = tool(
    async (_, { configurable }) => {
        const clerkId = configurable?.clerkId;
        if (!clerkId) throw new Error("Unauthorized user context");

        const orders = await Order.find({ clerkId }).sort({ createdAt: -1 }).limit(5).lean();
        return JSON.stringify(orders);
    },
    {
        name: "get_user_orders",
        description: "Fetch the logged-in user's recent orders, shipping addresses, and delivery status.",
        schema: z.object({}),
    }
);

export const manageCartTool = tool(
    async ({ action, productId, quantity = 1 }, config) => {
        const context = getUserContext();
        const clerkId = config?.configurable?.clerkId || context?.clerkId;
        const userId = config?.configurable?.userId || context?.userId;

        if (!clerkId) {
            console.error("❌ Tool execution failed: clerkId missing from config!", config);
            throw new Error("Unauthorized user context");
        }

        // 1. Fetch or create cart (including both clerkId and user _id if available in context)
        let cart = await Cart.findOne({ clerkId });
        if (!cart) {
            cart = await Cart.create({
                clerkId,
                user: userId || undefined, // Populates user _id if provided
                items: [],
            });
        }

        // 2. Clear Cart Action
        if (action === "CLEAR") {
            cart.items = [];
            await cart.save();
            return "Cart cleared successfully.";
        }

        // 3. Validate productId for actions that require it
        if (!productId) {
            return "Error: 'productId' is required for ADD, UPDATE, or REMOVE actions.";
        }

        // 4. Remove Action
        if (action === "REMOVE") {
            const initialCount = cart.items.length;
            cart.items = cart.items.filter((i) => i.product.toString() !== productId);

            if (cart.items.length === initialCount) {
                return "Item was not found in the cart.";
            }

            await cart.save();
            return `Item removed successfully. Total distinct items in cart: ${cart.items.length}`;
        }

        // 5. Add / Update Actions (Require Product Lookup & Stock Check)
        const product = await Product.findById(productId);
        if (!product) return "Error: Product not found.";

        const existingItem = cart.items.find((i) => i.product.toString() === productId);

        if (action === "ADD") {
            const currentQty = existingItem ? existingItem.quantity : 0;
            const targetQuantity = currentQty + quantity;

            if (product.stock < targetQuantity) {
                return `Error: Cannot add ${quantity} more. Stock is ${product.stock}, and you already have ${currentQty} in cart.`;
            }

            if (existingItem) {
                existingItem.quantity = targetQuantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        } else if (action === "UPDATE") {
            if (quantity < 1) {
                return "Error: Quantity must be at least 1. Use REMOVE action to delete items.";
            }

            if (!existingItem) {
                return "Error: Item is not currently in the cart to update.";
            }

            if (product.stock < quantity) {
                return `Error: Insufficient stock. Only ${product.stock} units available.`;
            }

            existingItem.quantity = quantity;
        }

        await cart.save();

        // Calculate total item count for clear LLM feedback
        const totalItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        return `Success: Cart updated. Product '${product.name}' now has quantity ${action === "ADD" ? (existingItem ? existingItem.quantity : quantity) : quantity
            }. Total items in cart: ${totalItemCount}.`;
    },
    {
        name: "manage_cart",
        description: "Add, set quantity, remove items, or clear the user's shopping cart.",
        schema: z.object({
            action: z.enum(["ADD", "UPDATE", "REMOVE", "CLEAR"]).describe("The cart action to perform"),
            productId: z.string().optional().describe("The MongoDB _id of the product"),
            quantity: z.number().optional().default(1).describe("Quantity to set or add (minimum 1)"),
        }),
    }
);