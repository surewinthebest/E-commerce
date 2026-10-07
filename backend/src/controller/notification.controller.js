import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export async function sendNotification(req, res) {
    try {
        const { title, body, targetType, userId, url } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: "Title and body are required" });
        }

        let pushTokens = [];
        let recipientUser = null;

        if (targetType === "USER") {
            if (!userId) return res.status(400).json({ message: "UserId is required for targetType USER" });
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            
            recipientUser = user._id;
            if (user.expoPushToken) {
                pushTokens.push(user.expoPushToken);
            }
        } else {
            // Target ALL users with registered tokens
            const users = await User.find({ expoPushToken: { $ne: "" } }).select("expoPushToken");
            pushTokens = users.map(u => u.expoPushToken);
        }

        if (pushTokens.length === 0) {
            return res.status(400).json({ message: "No target users have active push tokens" });
        }

        // Construct Expo Push Messages
        const messages = pushTokens.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            channelId: "default",
            data: { url },
        }));

        // Send to Expo Push Server
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });

        const expoResult = await response.json();

        // Save Notification log to MongoDB
        const notificationLog = await Notification.create({
            title,
            body,
            targetType: targetType ||  "ALL",
            recipientUser,
            url: url
        });

        res.status(200).json({
            message: "Notification sent successfully",
            expoResult,
            notification: notificationLog
        });
    } catch (error) {
        console.error("Error sending push notification:", error);
        res.status(500).json({ message: "Failed to send notification" });
    }
}

export async function getNotificationHistory(_, res) {
    try {
        const notifications = await Notification.find()
            .populate("recipientUser", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error("Error in getNotificationHistory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserNotificationHistory(req, res) {
    try {
        const user = req.user;
        const notifications = await Notification.find({ recipientUser: user._id  })
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error("Error in getUserNotificationHistory:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}