import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from "../controller/cart.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;