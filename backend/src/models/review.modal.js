import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
 productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    Unique: true,
 },
 userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    Unique: true,
 },
 orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    Unique: true,
 },
 ratign:{
    type: Number,
    min:1,
    max:5,
 },
}, {timestamps:true})

export const Review = mongoose.model("Review", reviewSchema);