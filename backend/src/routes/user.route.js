import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addAddress, getAddresses, updateAddress, deleteAddress, addToWishlist, getWishlist, removeFromWishlist } from "../controller/user.controller.js";

const router = Router();

router.use(protectRoute);

//Address routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

//Wishlist routes
router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;