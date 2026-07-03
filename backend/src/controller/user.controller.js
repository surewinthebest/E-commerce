export async function addAddress(req, res) {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;

        const user = req.user;

        if (!fullName || !streetAddress || !city || !state || !zipCode)
            return res.status(400).json({ message: "Missing required address fields" });

        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            })
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false,
        })

        await user.save();

        res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
    } catch (error) {
        console.error("Error in addAddress controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export async function getAddresses(req, res) {
    try {
        const user = req.user;
        res.status(200).json({ addresses: user.addresses });
    } catch (error) {
        console.error("Error in getAddresses controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateAddress(req, res) {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;

        const user = req.user;
        const { addressId } = req.params;
        const updateAddress = user.addresses.id(addressId);

        if (!updateAddress) return res.status(404).json({ message: "Address not found" });

        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            })
        }

        updateAddress.label = label || updateAddress.label;
        updateAddress.fullName = fullName || updateAddress.fullName;
        updateAddress.streetAddress = streetAddress || updateAddress.streetAddress;
        updateAddress.city = city || updateAddress.city;
        updateAddress.state = state || updateAddress.state;
        updateAddress.zipCode = zipCode || updateAddress.zipCode;
        updateAddress.phoneNumber = phoneNumber || updateAddress.phoneNumber;
        updateAddress.isDefault = isDefault || updateAddress.isDefault;

        await user.save();

        res.status(200).json({ message: "Address updated successfully", addresses: user.addresses })
    } catch (error) {
        console.error("Error in updateAddress controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteAddress(req, res) {
    try {
        const user = req.user;
        const { addressId } = req.params;
        user.addresses.pull(addressId);

        await user.save();

        res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses })
    } catch (error) {
        console.error("Error in deleteAddress controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export async function addToWishlist(req, res) {
    try {
        const user = req.user;
        const { productId } = req.body;

        if (user.wishlist.includes(productId)) return res.status(400).json({ message: "Product already in wishlist" });

        user.wishlist.push(productId);

        await user.save();

        res.status(200).json({ message: "Product added successfully", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error in addToWishlist controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getWishlist(req, res) {
    try {
        const user = req.user;
        const wishlist = await user.wishlist.populate("Product");
        res.status(200).json({ wishlist: wishlist });
    } catch (error) {
        console.error("Error in getWishlist controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const user = req.user;

        const { productId } = req.params;
        if (!user.wishlist.includes(productId)) return res.status(400).json({ message: "Product not found in wishlist" });

        user.wishlist.pull(productId);

        await user.save();

        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error("Error in removeFromWishlist controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
