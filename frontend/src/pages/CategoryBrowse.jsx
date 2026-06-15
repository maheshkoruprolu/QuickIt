import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaArrowRight,
    FaShoppingCart,
    FaBoxOpen,
    FaChevronRight,
} from "react-icons/fa";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const themeClasses = [
    "from-emerald-500 via-teal-500 to-cyan-600",
    "from-indigo-600 via-violet-600 to-fuchsia-600",
    "from-amber-500 via-orange-500 to-rose-500",
    "from-slate-900 via-slate-800 to-indigo-900",
];

const CategoryBrowse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state?.cart?.cart || []);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoryRes, productRes] = await Promise.all([
                    Axios({ ...ApiEndpoints.get_category }),
                    Axios({ ...ApiEndpoints.get_product }),
                ]);

                if (categoryRes.data.success) {
                    setCategories(categoryRes.data.data);
                }

                if (productRes.data.success) {
                    setProducts(
                        productRes.data.data.filter(
                            (product) => product.publish
                        )
                    );
                }
            } catch (error) {
                AxiosToastError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const activeCategory = useMemo(
        () => categories.find((category) => category._id === id),
        [categories, id]
    );

    const categoryProducts = useMemo(() => {
        return products.filter((product) => {
            return (product.categoryId || []).some((category) => {
                if (typeof category === "object") {
                    return category._id === id;
                }

                return category === id;
            });
        });
    }, [products, id]);

    const relatedCategories = categories
        .filter((category) => category._id !== id)
        .slice(0, 6);

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...ApiEndpoints.add_to_cart,
                data: { productId },
            });

            if (response.data.success) {
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

    const cartHasProduct = (productId) => {
        return cart.some((item) => item.productId?._id === productId);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            <div
                className={`relative overflow-hidden bg-gradient-to-br ${themeClasses[id?.length ? id.length % themeClasses.length : 0]} text-white`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]"></div>
                <div className="container mx-auto px-4 py-10 lg:py-14 relative z-10">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/75 mb-4">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <FaChevronRight className="text-[10px]" />
                        <span>Collections</span>
                        <FaChevronRight className="text-[10px]" />
                        <span className="text-white font-semibold">
                            {activeCategory?.name || "Category"}
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                        <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/10 text-[11px] uppercase tracking-[0.18em] font-semibold backdrop-blur-sm mb-4">
                                Category Storefront
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                                {activeCategory?.name ||
                                    "Explore this collection"}
                            </h1>
                            <p className="mt-4 text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed">
                                Discover products from this collection in a
                                clean, shop-style view.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/search")}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all"
                                >
                                    Search all products{" "}
                                    <FaArrowRight size={12} />
                                </button>
                                <div className="inline-flex items-center px-5 py-3 rounded-full bg-white/10 border border-white/10 text-sm font-semibold backdrop-blur-sm">
                                    {categoryProducts.length} products
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 border border-white/10 rounded-[2rem] p-5 sm:p-6 backdrop-blur-md shadow-2xl">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                                        <FaBoxOpen className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
                                            Collection
                                        </p>
                                        <p className="text-lg font-bold">
                                            {categoryProducts.length} items
                                        </p>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/15 p-2 flex items-center justify-center">
                                    <img
                                        src={activeCategory?.image}
                                        alt={activeCategory?.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">
                                        Products
                                    </p>
                                    <p className="text-2xl font-extrabold mt-1">
                                        {categoryProducts.length}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">
                                        Related
                                    </p>
                                    <p className="text-2xl font-extrabold mt-1">
                                        {relatedCategories.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link
                        to="/search"
                        className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                        All products
                    </Link>
                    {relatedCategories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/categories/${category._id}`}
                            className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="h-12 w-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                    </div>
                ) : categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                        {categoryProducts.map((product) => (
                            <Link
                                to={`/product-details/${product._id}`}
                                key={product._id}
                                className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-100 card-hover flex flex-col group relative overflow-hidden"
                            >
                                {product.discount > 0 && (
                                    <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-red-500 text-white text-[10px] lg:text-xs font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded z-10 shadow-sm">
                                        {product.discount}% OFF
                                    </div>
                                )}

                                <div className="h-28 lg:h-40 w-full mb-3 lg:mb-4 rounded-lg lg:rounded-xl bg-slate-50 flex items-center justify-center p-2 lg:p-4 group-hover:bg-slate-100 transition-colors">
                                    {product.image && product.image[0] ? (
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
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
                                        {product.unit}
                                    </span>
                                    <h3 className="font-semibold text-sm lg:text-base text-slate-800 line-clamp-2 mb-1.5 lg:mb-2 flex-grow group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-4">
                                        <span className="font-bold text-sm lg:text-lg text-slate-900">
                                            ₹{product.price}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className="text-[10px] lg:text-sm text-slate-400 line-through">
                                                ₹
                                                {Math.round(
                                                    product.price *
                                                        (1 +
                                                            product.discount /
                                                                100)
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {cartHasProduct(product._id) ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/cart");
                                            }}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs lg:text-base font-semibold py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 lg:gap-2 mt-auto"
                                        >
                                            <FaShoppingCart /> Go to Cart
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) =>
                                                handleAddToCart(e, product._id)
                                            }
                                            className="w-full bg-slate-100 hover:bg-emerald-500 text-slate-700 hover:text-white text-xs lg:text-base font-semibold py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 lg:gap-2 mt-auto"
                                        >
                                            <FaShoppingCart /> Add
                                        </button>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FaBoxOpen className="text-3xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">
                            No products in this collection yet
                        </h3>
                        <p className="text-slate-500 max-w-sm">
                            This category is live, but there are no published
                            products available right now. Explore other
                            collections or search the full catalog.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link
                                to="/search"
                                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                            >
                                Browse all products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryBrowse;
