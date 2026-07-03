import { Order } from "../models/order.modal.js";
import { Product } from "../models/product.modal.js";
import { Review } from "../models/review.modal.js";

export async function createOrder(req, res) {
    const session = await Product.startSession();
    session.startTransaction;
    try {
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
        const user = req.user;

        if (!orderItems || orderItems.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Order not found" });
        }

        //validate product and stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product._id).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: "No order items provided" });
            }


            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
            }
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
            await Product.findByIdAndUpdate(item.product._id,
                {
                    $inc: { stock: -item.quantity }
                },
                { session },
            )
        }

        await session.abortTransaction();
        session.endSession();
        res.status(201).json({ message: "Order created successfully", order: order });
    } catch (error) {
        console.error("Error in createOrder controller", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId }).populate(orderItems?.product).sort({ createdAt: -1 });
        //check if each order has been reviewed 
        const orderIds = orders.map(order=> order._id);
        const reviews = Review.find({orderId:{$in:orderIds}});
        const reviewOrderIds = new Set(reviews.map(review=> review.orderId.toString()));

        const orderWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                return {
                    ...order.toObject(),
                    hasReviewed: reviewOrderIds.has(order._id.toString()),
                }
            })
        )

        res.status(200).json({ orders: orderWithReviewStatus });
    } catch (error) {
        console.error("Error in createOrder controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
