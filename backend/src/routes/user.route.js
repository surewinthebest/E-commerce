import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserProfile, addAddress, getAddresses, updateAddress, deleteAddress, addToWishlist, getWishlist, removeFromWishlist, updatePushToken } from "../controller/user.controller.js";

const router = Router();

router.use(protectRoute);

// Profile
router.get("/profile", getUserProfile);

//Address routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

//Wishlist routes
router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

//notification routes
router.put("/push-token", updatePushToken);


export default router;