import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
        },
        orderId: {
            type: String,
            required: [true, "Please provide orderId"],
            unique: true,
        },
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: "product",
        },
        product_details: {
            name: String,
            image: Array,
        },
        paymentId: {
            type: String,
            default: null,
        },
        paymentStatus: {
            type: String,
            default: "",
        },
        delivery_address: {
            type: mongoose.Schema.ObjectId,
            ref: "address",
        },
        subTotal: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
        invoice_receipt: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
