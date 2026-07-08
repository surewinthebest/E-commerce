import { Product } from "../models/product.model.js";

export async function getProductById(req, res) {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.status(200).json({ product: product });
    } catch (error) {
        console.error("Error in getProductById controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}