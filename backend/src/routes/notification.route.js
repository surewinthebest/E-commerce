import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendNotification, getNotificationHistory, getUserNotificationHistory } from "../controller/notification.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/send", sendNotification);
router.get("/history", getNotificationHistory);
router.get("/history", getUserNotificationHistory);

export default router;