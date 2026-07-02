import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
 productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    unique: true,
 },
 userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
 },
 orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    unique: true,
 },
 rating:{
    type: Number,
    min:1,
    max:5,
 },
}, {timestamps:true})

export const Review = mongoose.model("Review", reviewSchema);