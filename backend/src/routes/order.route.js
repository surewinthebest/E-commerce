import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders } from "../controller/order.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/orders", createOrder);
router.get("/orders", getUserOrders);

export default router;