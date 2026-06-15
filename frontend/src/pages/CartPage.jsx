import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaTrashAlt,
} from "react-icons/fa";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import { updateCartItem, removeCartItem } from "../store/cartSlice";

const CartPage = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state?.cart?.cart || []);
    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();

    const handleQtyChange = async (cartItemId, currentQty, amount) => {
        const newQty = currentQty + amount;

        if (newQty <= 0) {
            try {
                const res = await Axios({
                    ...ApiEndpoints.delete_cart_item,
                    data: { _id: cartItemId },
                });
                if (res.data.success) {
                    dispatch(removeCartItem(cartItemId));
                }
            } catch (error) {
                console.error(error);
            }
            return;
        }

        try {
            const res = await Axios({
                ...ApiEndpoints.update_cart_item,
                data: { _id: cartItemId, qty: newQty },
            });
            if (res.data.success) {
                dispatch(updateCartItem({ _id: cartItemId, qty: newQty }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const totalPrice = cart.reduce(
        (acc, curr) => acc + (curr.productId?.price || 0) * curr.quantity,
        0
    );
    const totalDiscount = cart.reduce((acc, curr) => {
        const product = curr.productId;
        if (!product || !product.discount) return acc;
        const originalPrice = Math.round(
            product.price * (1 + product.discount / 100)
        );
        return acc + (originalPrice - product.price) * curr.quantity;
    }, 0);

    if (!user?._id) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4">
                        <FaShoppingCart />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
                        Login to view your cart
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Save items, adjust quantities, and move to checkout from
                        one secure place.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-500 transition-colors"
                    >
                        Login <FaArrowRight size={12} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-6 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Cart
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800">
                        Shopping Cart
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Review your items and continue to checkout when ready.
                    </p>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
                        <div className="w-20 h-20 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-3xl text-slate-300 mb-4">
                            <FaShoppingCart />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-slate-500 mb-6">
                            Add products you like and come back here to complete
                            your order.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-500 transition-colors"
                        >
                            Continue Shopping <FaArrowRight size={12} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
                        <div className="flex flex-col gap-4">
                            {cart.map((item) => {
                                const product = item.productId;
                                if (!product) return null;

                                return (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-4 sm:p-5 flex gap-4"
                                    >
                                        <Link
                                            to={`/product-details/${product._id}`}
                                            className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-slate-100"
                                        >
                                            {product.image &&
                                            product.image[0] ? (
                                                <img
                                                    src={product.image[0]}
                                                    alt={product.name}
                                                    className="max-h-full object-contain mix-blend-multiply"
                                                />
                                            ) : (
                                                <div className="text-xs text-slate-400">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex-grow flex flex-col justify-between min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <Link
                                                        to={`/product-details/${product._id}`}
                                                        className="font-bold text-lg text-slate-800 hover:text-emerald-600 transition-colors line-clamp-1"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {product.unit}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleQtyChange(
                                                            item._id,
                                                            item.quantity,
                                                            -item.quantity
                                                        )
                                                    }
                                                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Remove item"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                                                <div className="inline-flex items-center bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <button
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                item._id,
                                                                item.quantity,
                                                                -1
                                                            )
                                                        }
                                                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                                    >
                                                        <FaMinus size={12} />
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-slate-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                item._id,
                                                                item.quantity,
                                                                1
                                                            )
                                                        }
                                                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                                    >
                                                        <FaPlus size={12} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                                                        Subtotal
                                                    </p>
                                                    <span className="font-extrabold text-lg text-slate-900">
                                                        ₹
                                                        {product.price *
                                                            item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-full lg:w-auto">
                            <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-5 lg:p-6 sticky top-24">
                                <h3 className="font-extrabold text-xl text-slate-800 mb-5">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Item total</span>
                                        <span className="font-semibold">
                                            ₹{totalPrice + totalDiscount}
                                        </span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-semibold">
                                                -₹{totalDiscount}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Delivery fee</span>
                                        <span className="font-semibold">
                                            Free
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 mt-5 pt-5 flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                                            Grand total
                                        </p>
                                        <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                            ₹{totalPrice}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-full hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout{" "}
                                    <FaArrowRight size={12} />
                                </button>

                                <p className="text-xs text-slate-400 mt-4 text-center">
                                    Secure checkout • Fast delivery • Easy
                                    returns
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
