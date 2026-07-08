import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category)
            return res.status(400).json({ message: "All fields are required" })

        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "At least one image is required" })

        if (req.files.length > 3)
            return res.status(400).json({ message: "Maximum 3 images allowed" })

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        })

        const uploadResults = await Promise.all(uploadPromises);

        const imageUrls = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        })

        res.status(201).json({ message: "Product is created successfully", product });
    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllProducts(_, res) {
    try {
        //sort most recent product created first
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const updateProduct = await Product.findById(id);
        if (!updateProduct) return res.status(404).json({ message: "Product not found" });

        if (name) updateProduct.name = name;
        if (description) updateProduct.description = desciption;
        if (price !== undefined) updateProduct.price = parseFloat(price);
        if (stock !== undefined) updateProduct.stock = parseInt(stock);
        if (category) updateProduct.category = category;

        //update image
        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) return res.status(400).json({ message: "Maximum 3 images are allowed" });
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                })
            })

            const uploadResult = await Promise.all(uploadPromises);

            const imageUrls = uploadResult.map((result) => result.secure_url);

            if (imageUrls) updateProduct.images = imageUrls;
        }

        await updateProduct.save();
        res.status(200).json({ message: "Product is updated successfully", updateProduct });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ error: "Product not found" });

        //delete image from cloudinary
        if (!product.images || product.images.length === 0) {
            const deletePromises = product.images.map((imageUrl) => {
                //Extract public_id from URL (assume format: .../products/publicId.ext)
                const publicId = "products/" + imageUrl.split("products/")[1]?.split(".")[0];
                if (publicId) return cloudinary.uploader.destroy(productId);
            })
            await Promise.all(deletePromises.filter(Boolean));
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getAllOrders(_, res) {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "shipped", "delivered"].includes(status))
            return res.status(400).json({ message: "Invalid Order Status" });

        const updateOrder = await Order.findById(orderId);
        if (!updateOrder) return res.status(404).json({ message: "Order not found" });

        updateOrder.status = status;

        if (status === "shipped" && !updateOrder.shippedAt) {
            updateOrder.shippedAt = new Date();
        }
        if (status === "delivered" && !updateOrder.deliveredAt) {
            updateOrder.deliveredAt = new Date();
        }

        await updateOrder.save();

        res.status(200).json({ message: "Order status is updated successfully", updateOrder });
    } catch (error) {
        console.error("Error in updating the order status", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllCustomer(_, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ customers });
    } catch (error) {
        console.error("Error fetching customer", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDashboardStats(req, res) {
    try {
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ])
        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({ totalOrders, totalRevenue, totalCustomers, totalProducts });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
