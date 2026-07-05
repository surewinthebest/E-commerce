import { Product } from "../models/product.modal.js";

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.status(201).json({ product: product });
    } catch (error) {
        console.error("Error in getProductById controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}