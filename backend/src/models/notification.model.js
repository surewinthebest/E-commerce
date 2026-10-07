import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    targetType: {
        type: String,
        enum: ["ALL", "USER"],
        default: "ALL",
    },
    recipientUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    // Stores either an internal app route ("/product/123") or external web URL ("https://...")
    url: {
        type: String,
        default: "",
        trim: true,
    },
    sentBy: {
        type: String, // Clerk ID or Admin Name
        default: "Admin",
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);