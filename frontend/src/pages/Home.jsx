import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingCart, FaBolt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state?.cart?.cart || []);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const categoryThemes = [
        "from-emerald-500 via-teal-500 to-cyan-600",
        "from-indigo-600 via-violet-600 to-fuchsia-600",
        "from-amber-500 via-orange-500 to-rose-500",
        "from-slate-900 via-slate-800 to-indigo-900",
        "from-cyan-600 via-sky-600 to-blue-700",
        "from-lime-500 via-emerald-500 to-green-600",
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const catRes = await Axios({ ...ApiEndpoints.get_category });
                if (catRes.data.success) setCategories(catRes.data.data);

                // Fetch Products
                const prodRes = await Axios({ ...ApiEndpoints.get_product });
                if (prodRes.data.success) {
                    setProducts(
                        prodRes.data.data.filter((p) => p.publish).slice(0, 10)
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        try {
            const res = await Axios({
                ...ApiEndpoints.add_to_cart,
                data: { productId },
            });
            if (res.data.success) {
                toast.success("Added to cart!");
                const cartData = await Axios({ ...ApiEndpoints.get_cart_item });
                if (cartData.data.success) {
                    dispatch(setCart(cartData.data.data));
                }
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to add to cart"
            );
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Modern Premium Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 pt-16 pb-24 lg:pt-28 lg:pb-36 text-white">
                {/* Background Glow Effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Grid Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTIwIDBoLTIwdjIwaDIwVjB6bS0xIDE5SDFWMWgxOHYxOHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-30"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        <FaBolt className="text-emerald-400" />
                        <span className="text-sm font-semibold tracking-wide text-indigo-100">
                            Lightning Fast Delivery
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                        Daily Essentials, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Delivered in Minutes.
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl font-light">
                        Skip the store and the lines. Shop fresh produce, daily
                        essentials, and exclusive deals with instant doorstep
                        delivery.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            to="/search"
                            className="group bg-emerald-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center gap-3"
                        >
                            Start Shopping{" "}
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Bottom decorative wave matching the body background */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-[40px] lg:h-[80px]"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
                            className="fill-slate-50"
                        ></path>
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 lg:mt-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Categories Section */}
                        <div className="mb-12 lg:mb-16">
                            <div className="flex justify-between items-end mb-6 lg:mb-8">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                                        Explore Categories
                                    </h2>
                                    <p className="text-sm lg:text-base text-slate-500 mt-1 lg:mt-2">
                                        Tap a collection to jump into a curated
                                        storefront
                                    </p>
                                </div>
                            </div>

                            <div className="flex overflow-x-auto gap-5 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x">
                                {categories.map((cat, index) => (
                                    <Link
                                        to={`/categories/${cat._id}`}
                                        key={cat._id}
                                        className="snap-start min-w-[240px] sm:min-w-[280px] lg:min-w-[320px] group relative overflow-hidden rounded-[2rem] shadow-xl border border-white/10 bg-slate-900 text-white"
                                    >
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${categoryThemes[index % categoryThemes.length]}`}
                                        ></div>
                                        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                                        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors"></div>

                                        <div className="relative h-64 p-6 flex flex-col justify-between">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                                                    Shop Collection
                                                </span>
                                                <span className="text-xs font-semibold text-white/80">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-end justify-between gap-4">
                                                <div className="max-w-[60%]">
                                                    <h3 className="text-2xl font-bold leading-tight line-clamp-2">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-sm text-white/80 mt-2 leading-relaxed">
                                                        Curated picks, everyday
                                                        essentials, and best
                                                        sellers in one premium
                                                        collection.
                                                    </p>
                                                </div>

                                                <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/10 backdrop-blur-md p-3 flex items-center justify-center shadow-2xl">
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.name}
                                                        className="w-full h-full object-contain drop-shadow-2xl"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                                                Explore{" "}
                                                <FaArrowRight size={12} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Featured Products */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-6 lg:mb-8">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                                        Featured Products
                                    </h2>
                                    <p className="text-sm lg:text-base text-slate-500 mt-1 lg:mt-2">
                                        Handpicked deals just for you
                                    </p>
                                </div>
                                <Link
                                    to="/search"
                                    className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 text-sm lg:text-base"
                                >
                                    View All <FaArrowRight size={12} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
                                {products.map((prod) => (
                                    <Link
                                        to={`/product-details/${prod._id}`}
                                        key={prod._id}
                                        className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-100 card-hover flex flex-col group relative overflow-hidden"
                                    >
                                        {/* Discount Badge */}
                                        {prod.discount > 0 && (
                                            <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-red-500 text-white text-[10px] lg:text-xs font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded z-10 shadow-sm">
                                                {prod.discount}% OFF
                                            </div>
                                        )}

                                        <div className="h-28 lg:h-48 w-full mb-3 lg:mb-4 rounded-lg lg:rounded-xl bg-slate-50 flex items-center justify-center p-2 lg:p-4 group-hover:bg-slate-100 transition-colors">
                                            {prod.image && prod.image[0] ? (
                                                <img
                                                    src={prod.image[0]}
                                                    alt={prod.name}
                                                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="text-slate-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow flex flex-col">
                                            <span className="text-[10px] lg:text-xs text-slate-500 mb-0.5 lg:mb-1">
                                                {prod.unit}
                                            </span>
                                            <h3 className="font-semibold text-sm lg:text-base text-slate-800 line-clamp-2 mb-1.5 lg:mb-2 flex-grow group-hover:text-indigo-600 transition-colors">
                                                {prod.name}
                                            </h3>

                                            <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-4">
                                                <span className="font-bold text-sm lg:text-lg text-slate-900">
                                                    ₹{prod.price}
                                                </span>
                                                {prod.discount > 0 && (
                                                    <span className="text-[10px] lg:text-sm text-slate-400 line-through">
                                                        ₹
                                                        {Math.round(
                                                            prod.price *
                                                                (1 +
                                                                    prod.discount /
                                                                        100)
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {cart.some(
                                                (item) =>
                                                    item.productId?._id ===
                                                    prod._id
                                            ) ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate("/cart");
                                                    }}
                                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs lg:text-base font-semibold py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 lg:gap-2"
                                                >
                                                    <FaShoppingCart /> Go to
                                                    Cart
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) =>
                                                        handleAddToCart(
                                                            e,
                                                            prod._id
                                                        )
                                                    }
                                                    className="w-full bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white text-xs lg:text-base font-semibold py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 lg:gap-2"
                                                >
                                                    <FaShoppingCart /> Add
                                                </button>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
