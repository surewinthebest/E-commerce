import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook } from "../controller/payment.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/create-intent", createPaymentIntent);

// No auth needed - Stripe validates via signature
router.post("/webhook", handleWebhook);

export default router;