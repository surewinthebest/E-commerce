import Stripe from "stripe";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js"
import { ENV } from "../config/env.js"

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
    try {
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        let subtotal = 0;
        const validatedItems = [];

        for (const item of cartItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            const itemPrice = Number(product.price);
            subtotal += itemPrice * item.quantity;
            validatedItems.push({
                productId: product._id?.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            })
        }

        const shipping = 10.0; // $10
        const tax = subtotal * 0.08; // 8%
        const total = subtotal + shipping + tax;

        if (total <= 0) {
            return res.status(400).json({ error: "Invalid order total" });
        }

        let customer;
        if (user.stripeCustomerId !== "") {
            customer = await stripe.customers.retrieve(user.stripeCustomerId);
        } else {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: user.clerkId,
                    userId: user._id.toString(),
                },
            });

            await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
        }

        const paymentIntents = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // convert to cents
            currency: "hkd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                clerkId: user.clerkId,
                userId: user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: total.toFixed(2),
            },
        })

        res.status(200).json({ clientSecret: paymentIntents.client_secret })
    } catch (error) {
        console.error("Error in createPaymentIntent controller", error);
        res.status(500).json({ error: "Failed to create payment intent" });
    }
}

export async function handleWebhook(req, res) {
    const sign = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sign, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        try {
            const { userId, clerkId, orderItems, shippingAddress, totalPrice } = paymentIntent.metadata;
            const existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id });
            if (existingOrder) {
                return res.json({ received: true });
            }
            const parsedOrderItems = JSON.parse(orderItems);
            const order = await Order.create({
                user: userId,
                clerkId: clerkId,
                orderItems: parsedOrderItems,
                shippingAddress: JSON.parse(shippingAddress),
                paymentResult: {
                    id: paymentIntent.id,
                    status: "succeeded",
                },
                totalPrice: Number(totalPrice),
                status: "pending",
            });

            // update product stock
            for (const item of parsedOrderItems) {
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: item.productId, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } }
                );
                if (!updatedProduct) {
                    console.error(`Insufficient stock for product ${item.name}`);
                }
            }

            console.log("Order created successfully:", order._id);
        } catch (error) {
            console.error("Error creating order from webhook:", error);
        }
    }
    res.json({ received: true });
}