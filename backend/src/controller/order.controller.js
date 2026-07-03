import { Order } from "../models/order.modal.js";
import { Product } from "../models/product.modal.js";
import { Review } from "../models/review.modal.js";

export async function createOrder(req, res) {
    try {
        const { orderItems, shippingAddress, paymentResult, totalPrice } = res.body;

        if (!orderItems || orderItems.length === 0)
            return res.status(404).json({ error: "Order not found" });

        //validate product and stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product._id);
            if (!product) return res.status(404).json({ error: `Product ${item.name} not found` });

            if (product.stock < item.quantity)
                return res.status(400).json({ error: `Insufficient product ${product.name} not found` });
        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        })

        //product stock update
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }

            })
        }

        res.status(201).json({ message: "Order created successfully", order: order });
    } catch (error) {
        console.error("Error in createOrder controller", error);
        res.state(500).json({ error: "Internal Server Error" });
    }
}

export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId }).populate(orderItems.product).sort({ createdBy: -1 });

        //check if each order has been reviewed 
        const orderWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                const review = await Review.find({ orderId: order._id });
                return {
                    ...order.toObject(),
                    hasReviewed: !!review,
                }
            })
        )

        res.status(200).json({ orders: orderWithReviewStatus });
    } catch (error) {
        console.error("Error in createOrder controller", error);
        res.state(500).json({ error: "Internal Server Error" });
    }
}
