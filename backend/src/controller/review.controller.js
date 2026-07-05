import { Product } from "../models/product.modal.js";
import { Order } from "../models/order.modal.js";
import { User } from "../models/user.modal.js";
import { Review } from "../models/review.modal.js";
import { startSession } from "mongoose";

export async function createReview(req, res) {
    const session = await Product.startSession();
    session.startTransaction();
    try {
        const { productId, orderId, rating } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        const order = await Order.findById(orderId);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Product Not Found" });
        }

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User Not Found" });
        }

        if (!rating || rating < 1 || rating > 5) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Rating must be between 1 to 5" });
        }

        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Order not found" });
        }

        if (order.status !== "delivered") {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ error: "Can only review delivered order" });
        }

        if (user.clerkId !== order.clerkId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ error: "Not authorized to review this order " });
        }

        //verify product is in the order
        const productInOrder = order.orderItems.some(order => order.product.toString() === productId.toString());
        if (!productInOrder) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Product not found in this order" });
        }

        const existingReview = await Review.findOne({ productId, userId: req.user._id });
        if (existingReview) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "You have already reviewed this product" });
        }

        const createReview = await Review.create({
            productId,
            userId,
            orderId,
            rating
        });

        //update this product averageRating
        const allReviewsForThisProduct = await Review.find({ productId: productId });
        const finalAverageRating = allReviewsForThisProduct.reduce((sum, rev) => sum + rev.rating, 0) / allReviewsForThisProduct.length;
        const updatedProduct = await Product.findByIdAndUpdate(product._id, {
            averageRating: finalAverageRating,
            totalReviews: finalAverageRating.length,
        }, { session })

        if (!updatedProduct) {
            await session.abortTransaction();
            session.endSession();
            await Review.findByIdAndDelete(createReview._id);
            return res.status(404).json({ error: "Product not found" });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Review submitted successfully", review: createReview });
    } catch (error) {
        console.error("Error in createReview controller", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteReview(req, res) {
    const session = await startSession();
    session.startTransaction();
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;
        const review = await Review.findById(reviewId);

        if (!review) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.userId.toString() !== userId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ error: "You are not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId, { session });

        //change the product averageRating and totalReviews
        const reviews = await Review.find({ productId: review.productId });
        const product = await Product.findByIdAndUpdate(review.productId, {
            averageRating: reviews.length > 0 ? reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length : 0,
            totalReviews: reviews.length,
        }, { session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error in deleteReview controller", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Internal Server Error" });
    }
}