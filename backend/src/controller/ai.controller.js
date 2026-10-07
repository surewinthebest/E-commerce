import { ChatOpenAI } from "@langchain/openai";
import { ENV } from "../config/env.js"
import { SystemMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import {
    semanticProductSearchTool,
    getUserOrdersTool,
    manageCartTool,
} from "../ai/tools.js";
import { userContextStorage } from "../lib/userContext.js";
import { AIChatMsg } from "../models/ai.model.js";

const model = new ChatOpenAI({
    //   modelName: "gpt-4o",
    modelName: "deepseek-chat", // DeepSeek V3 / R1 compatible
    apiKey: ENV.DEEPSEEK_API_KEY,
    temperature: 0.2,
    configuration: {
        baseURL: "https://api.deepseek.com", // 👈 DeepSeek Base URL
    },
});

const tools = [semanticProductSearchTool, getUserOrdersTool, manageCartTool];

const systemPrompt = new SystemMessage(
    `You are an expert, courteous, and highly knowledgeable e-commerce customer service AI assistant.
Your capabilities:
1. Use 'semantic_product_search' to compare items, search features, and recommend alternatives mathematically based on feature proximity.
2. Use 'get_user_orders' to look up shipping status, order history, and tracking details when asked.
3. Use 'manage_cart' to add, update, or clear items directly for the user.

When comparing products, evaluate key differences in features, price, ratings, and ideal usage scenarios to give concise, professional recommendations.`
);

// Enable built-in memory checkpointer in LangGraph
const checkpointer = new MemorySaver();

const agent = createAgent({
    model,
    tools,
    systemPrompt,
    checkpointSaver: checkpointer,
});

export async function handleAIChat(req, res) {
    try {
        const { messages } = req.body;
        const user = req.user;

        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const clerkId = user.clerkId;

        if (!clerkId) {
            return res.status(401).json({ error: "Missing Clerk User ID in request context." });
        }

        const userId = user._id?.toString();
        const userMessage = Array.isArray(messages) ? messages[0] : messages;

        if (!userMessage || !userMessage.content) {
            return res.status(400).json({ error: "A valid user message content is required." });
        }

        // const formattedMessages = messages.map((m) => [
        //   m.role === "user" ? "user" : "assistant",
        //   m.content,
        // ]);

        const result = await userContextStorage.run({ clerkId, userId }, async () => {
            return await agent.invoke(
                { messages: [{ role: "user", content: userMessage.content }] },
                {
                    configurable: {
                        thread_id: clerkId,
                        clerkId: clerkId,
                        userId: userId
                    }
                }
            );
        });

        const lastMessage = result.messages[result.messages.length - 1];
        const assistantReply = lastMessage.content;

        // Save both the user prompt and AI response to MongoDB in parallel
        await Promise.all([
            AIChatMsg.create({
                clerkId: user.clerkId,
                role: "user",
                content: userMessage.content,
            }),
            AIChatMsg.create({
                clerkId: user.clerkId,
                role: "assistant",
                content: assistantReply,
            }),
        ]);

        const cartWasModified = result.messages.some(
            (msg) =>
                msg.name === "manage_cart" ||
                msg.additional_kwargs?.tool_calls?.some(tc => tc.function?.name === "manage_cart")
        );

        res.status(200).json({
            reply: lastMessage.content,
            cartUpdated: cartWasModified,
        });
    } catch (error) {
        console.error("AI Assistant Error:", error);
        res.status(500).json({ error: "Failed to process AI request" });
    }
}

export async function getAIChatHistory(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const limit = parseInt(req.query.limit, 10) || 10;
        const before = req.query.before; // Timestamp cursor for fetching older messages

        const query = { clerkId: user.clerkId };

        // If 'before' ISO string exists, fetch messages created before that timestamp
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await AIChatMsg.find(query)
            .sort({ createdAt: -1 }) // Newest first (ideal for inverted FlatList)
            .limit(limit)
            .lean();

        // Map internal _id and format response
        const formattedMessages = messages.map((m) => ({
            id: m._id.toString(),
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
        }));

        // Determine if there are more messages left to fetch
        const hasMore = formattedMessages.length === limit;

        res.status(200).json({
            messages: formattedMessages,
            hasMore,
        });
    } catch (error) {
        console.error("Fetch AI Chat History Error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
}