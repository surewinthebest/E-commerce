import { Router } from "express";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getAllCustomer, getDashboardStats } from "../controller/admin.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

//optimization DRY
router.use(protectRoute, adminOnly);

router.post("/products", upload.array("image", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("image", 3), updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomer);
router.get("/stats", getDashboardStats);

export default router;