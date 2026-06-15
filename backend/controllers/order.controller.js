import orderModel from "../models/order.model.js";
import cartProductModel from "../models/cartProduct.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

// Utility to generate a unique order ID
const generateOrderId = () => {
    return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

export const createOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId, subTotal, total } = req.body;

        if (!addressId) {
            return res.status(400).json({ message: "Delivery address is required", error: true, success: false });
        }

        // Get user's cart items
        const cartItems = await cartProductModel.find({ userId: userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty", error: true, success: false });
        }

        const orderId = generateOrderId();
        const orderPromises = cartItems.map(async (item) => {
            const product = item.productId;
            
            const orderPayload = new orderModel({
                userId: userId,
                orderId: orderId,
                productId: product._id,
                product_details: {
                    name: product.name,
                    image: product.image
                },
                paymentId: "PAY-" + Date.now(), // Simulated Payment ID
                paymentStatus: "SUCCESS", // Simulated Payment
                delivery_address: addressId,
                subTotal: (product.price * item.quantity),
                total: (product.price * item.quantity), // Simplification for per-item total
            });

            return await orderPayload.save();
        });

        const savedOrders = await Promise.all(orderPromises);

        // Add orders to user history
        const orderIds = savedOrders.map(order => order._id);
        await userModel.updateOne(
            { _id: userId },
            { $push: { orderHistory: { $each: orderIds } } }
        );

        // Clear user cart
        await cartProductModel.deleteMany({ userId: userId });
        await userModel.updateOne(
            { _id: userId },
            { $set: { shopping_cart: [] } }
        );

        return res.status(200).json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: savedOrders
        });

    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const getOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        
        const orders = await orderModel.find({ userId: userId })
            .populate('delivery_address')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders fetched successfully",
            error: false,
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};
