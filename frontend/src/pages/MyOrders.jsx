import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClock, FaShoppingBag } from "react-icons/fa";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";

const statusClasses = {
    delivered: "bg-emerald-50 text-emerald-700",
    shipped: "bg-blue-50 text-blue-700",
    processing: "bg-amber-50 text-amber-700",
    pending: "bg-slate-100 text-slate-600",
    cancelled: "bg-rose-50 text-rose-700",
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await Axios({
                    ...ApiEndpoints.order_history,
                });
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm border border-slate-200 text-slate-600">
                    <FaClock className="animate-pulse" /> Loading orders...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Orders
                </p>
                <h1 className="text-3xl font-extrabold text-slate-800">
                    My Orders
                </h1>
                <p className="text-slate-500 mt-2">
                    Track purchases, payment status, and order history.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-3xl text-slate-300 mb-4">
                        <FaBoxOpen />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
                        No orders yet
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Once you place an order, it will appear here with its
                        delivery progress.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-500 transition-colors"
                    >
                        Start Shopping <FaShoppingBag size={12} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const statusKey = String(
                            order.paymentStatus || "pending"
                        ).toLowerCase();
                        const statusClass =
                            statusClasses[statusKey] || statusClasses.pending;

                        return (
                            <article
                                key={order._id}
                                className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm p-4 sm:p-5 lg:p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                                            Order ID
                                        </p>
                                        <p className="font-bold text-slate-800 break-all">
                                            {order.orderId}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.12em] ${statusClass}`}
                                        >
                                            {order.paymentStatus || "Pending"}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid sm:grid-cols-[96px_1fr_auto] gap-4 items-center">
                                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                        {order.product_details?.image &&
                                        order.product_details.image[0] ? (
                                            <img
                                                src={
                                                    order.product_details
                                                        .image[0]
                                                }
                                                alt="product"
                                                className="max-h-full object-contain mix-blend-multiply"
                                            />
                                        ) : (
                                            <FaBoxOpen className="text-slate-300 text-2xl" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                                            {order.product_details?.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            {order.product_details
                                                ?.description ||
                                                "Order placed successfully and is being processed."}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                                            Total
                                        </p>
                                        <p className="font-extrabold text-2xl text-slate-900">
                                            ₹{order.total}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
