import mongoose from "mongoose";

const AIChatMessageSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const AIChatMsg = mongoose.model("AIChatMsg", AIChatMessageSchema);