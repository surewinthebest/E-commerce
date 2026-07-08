import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function addToCart(req, res) {
    try {
        const { productId, quantity = 1 } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);

        if (!user) return res.status(404).json({ error: "User not found" });
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.stock === 0) return res.status(400).json({ error: `Insufficient product ${product.name} ` });
        if (product.stock < quantity) return res.status(400).json({ error: `Insufficient product ${product.name} stock` });

        let cart = await Cart.findOne({ clerkId: user.clerkId });

        if (!cart) {
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        //check if item already in the cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            const newQuantity = quantity + existingItem.quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: "Insufficient stock" });
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json({ message: "Item added to cart", cart: cart });
    } catch (error) {
        console.error("Error in addToCart controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate("items.product");

        if (!cart) {
            const user = req.user;

            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error("Error in getCart controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export async function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);

        if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

        const cart = await Cart.findOne({ clerkId: user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.stock < quantity) return res.status(400).json({ error: "Insiffcient stock" });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(201).json({ message: "Cart updated successfully", cart: cart })
    } catch (error) {
        console.error("Error in updateCartItem controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export async function removeFromCart(req, res) {
    try {
        const { productId } = req.params;
        const user = req.user;

        const cart = await Cart.findOne({ clerkId: user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart: cart });
    } catch (error) {
        console.error("Error in removeFromCart controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export async function clearCart(req, res) {
    try {
        const user = req.user;

        const cart = await Cart.findOne({ clerkId: user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart: cart });
    } catch (error) {
        console.error("Error in clearCart controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};