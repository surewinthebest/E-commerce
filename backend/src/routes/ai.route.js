import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { handleAIChat, getAIChatHistory } from "../controller/ai.controller.js";


const router = Router();

//optimization DRY
router.use(protectRoute);

router.post("/chat", handleAIChat);
router.get("/history", getAIChatHistory);

export default router;