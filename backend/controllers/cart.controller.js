import cartProductModel from "../models/cartProduct.model.js";
import userModel from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Provide Product ID", error: true, success: false });
        }

        const checkCartItem = await cartProductModel.findOne({
            userId: userId,
            productId: productId
        });

        if (checkCartItem) {
            return res.status(400).json({ message: "Item already in cart", error: true, success: false });
        }

        const cartItem = new cartProductModel({
            quantity: 1,
            productId: productId,
            userId: userId
        });

        const save = await cartItem.save();

        await userModel.updateOne({ _id: userId }, {
            $push: { shopping_cart: save._id }
        });

        return res.status(200).json({ data: save, message: "Item Added successfully", error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const getCartItemController = async (req, res) => {
    try {
        const userId = req.userId;

        const cartItem = await cartProductModel.find({ userId: userId }).populate('productId');

        return res.status(200).json({ data: cartItem, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const updateCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id, qty } = req.body;

        if (!_id || !qty) {
            return res.status(400).json({ message: "Provide _id and qty", error: true, success: false });
        }

        const updateCartItem = await cartProductModel.updateOne({ _id: _id, userId: userId }, {
            ...(qty && { quantity: qty })
        });

        return res.status(200).json({ message: "Item updated", error: false, success: true, data: updateCartItem });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const deleteCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Provide _id", error: true, success: false });
        }

        const deleteCartItem = await cartProductModel.deleteOne({ _id: _id, userId: userId });

        await userModel.updateOne({ _id: userId }, {
            $pull: { shopping_cart: _id }
        });

        return res.status(200).json({ message: "Item deleted successfully", error: false, success: true, data: deleteCartItem });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};
