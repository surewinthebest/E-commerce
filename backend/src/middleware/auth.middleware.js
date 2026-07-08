import { getAuth } from "@clerk/express";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";

export const protectRoute = [
    async (req, res, next) => {
        try {
            const { userId } = getAuth(req);
            const clerkId = userId;
            if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

            const user = await User.findOne({ clerkId });
            if (!user) return res.status(404).json({ message: "User not found" });

            req.user = user;
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware", error);
            res.status(501).json({ message: "Internal Server Error" });
        }
    },
]

export const adminOnly = [
    (req, res, next) => {
        try {
            if (!req.user) return res.status(401).json({ message: "Unauthorized - User Not Found" });
            if (req.user.email !== ENV.ADMIN_EMAIL) return res.status(403).json({ message: "Forbidden - Admin Access Only" });
            next();
        } catch (error) {
            console.error("Error in adminOnly middleware", error)
            res.status(501).json({ message: "Internal Server Error" })
        }

    }
]