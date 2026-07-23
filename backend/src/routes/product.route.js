import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProducts } from "../controller/admin.controller.js"
import { getProductById } from "../controller/product.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllProducts);
router.get("/:productId", getProductById);

export default router;