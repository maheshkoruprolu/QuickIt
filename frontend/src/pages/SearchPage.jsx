import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FaFilter,
    FaTimes,
    FaSortAmountDown,
    FaShoppingCart,
    FaSearch,
} from "react-icons/fa";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import { setCart } from "../store/cartSlice";
import toast from "react-hot-toast";

const SearchPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state?.cart?.cart || []);
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";
    const categoryQuery = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("default");

    const selectedCategory = useMemo(
        () => categories.find((category) => category._id === categoryQuery),
        [categories, categoryQuery]
    );

    useEffect(() => {
        Axios({ ...ApiEndpoints.get_category }).then((response) => {
            if (response.data.success) {
                setCategories(response.data.data);
            }
        });
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);

            try {
                const response = await Axios({
                    ...ApiEndpoints.search_product,
                    data: {
                        search: query,
                        categoryId: categoryQuery,
                    },
                });

                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, categoryQuery]);

    const sortedProducts = useMemo(() => {
        const nextProducts = [...products];

        if (sortBy === "price_low") {
            nextProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_high") {
            nextProducts.sort((a, b) => b.price - a.price);
        }

        return nextProducts;
    }, [products, sortBy]);

    const handleCategoryClick = (catId) => {
        const nextParams = new URLSearchParams(searchParams);

        if (!catId || categoryQuery === catId) {
            nextParams.delete("category");
        } else {
            nextParams.set("category", catId);
        }

        setSearchParams(nextParams);
        setShowFilters(false);
    };

    const clearCategoryFilter = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("category");
        setSearchParams(nextParams);
    };

    const clearSearchQuery = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("q");
        setSearchParams(nextParams);
    };

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

    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex-grow lg:order-2">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white px-6 py-6 lg:px-8 lg:py-7">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                                <div className="max-w-2xl">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] uppercase tracking-[0.18em] font-semibold backdrop-blur-sm mb-4">
                                        Product search
                                    </span>
                                    <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                        {query
                                            ? `Results for “${query}”`
                                            : selectedCategory
                                              ? `${selectedCategory.name} collection`
                                              : "Browse products"}
                                    </h1>
                                    <p className="mt-3 text-sm lg:text-base text-white/70 max-w-xl leading-relaxed">
                                        Find what you need with a cleaner
                                        catalog view and compact filters.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
                                    <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4">
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-semibold">
                                            Items
                                        </p>
                                        <p className="text-lg font-bold mt-1">
                                            {products.length}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4">
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-semibold">
                                            Sort
                                        </p>
                                        <p className="text-lg font-bold mt-1">
                                            {sortBy === "default"
                                                ? "Relevance"
                                                : "Filtered"}
                                        </p>
                                    </div>
                                    <div className="col-span-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4 flex items-center gap-3 flex-wrap">
                                        <FaSearch className="text-white/70" />
                                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-white/90">
                                            {query && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10">
                                                    Search: {query}
                                                </span>
                                            )}
                                            {selectedCategory?.name && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10">
                                                    Category:{" "}
                                                    {selectedCategory.name}
                                                </span>
                                            )}
                                            {sortBy !== "default" && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10">
                                                    {sortBy === "price_low"
                                                        ? "Low to high"
                                                        : "High to low"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-4 lg:px-6 lg:py-5 border-t border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleCategoryClick("")}
                                    className={`px-4 py-2 rounded-full border font-semibold transition-colors ${!categoryQuery ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"}`}
                                >
                                    All
                                </button>
                                {categories.slice(0, 8).map((cat) => {
                                    const isSelected =
                                        categoryQuery === cat._id;
                                    return (
                                        <button
                                            key={cat._id}
                                            onClick={() =>
                                                handleCategoryClick(cat._id)
                                            }
                                            className={`px-4 py-2 rounded-full border font-semibold transition-colors ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"}`}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <span className="text-slate-500">
                                    <FaSortAmountDown />
                                </span>
                                <select
                                    className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Relevance</option>
                                    <option value="price_low">
                                        Price: Low to High
                                    </option>
                                    <option value="price_high">
                                        Price: High to Low
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 sm:hidden">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            <FaFilter className="text-indigo-600" /> Filters
                        </button>
                        <button
                            onClick={() => setSortBy("default")}
                            className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Reset sort
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                            {sortedProducts.map((prod) => (
                                <Link
                                    to={`/product-details/${prod._id}`}
                                    key={prod._id}
                                    className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-100 card-hover flex flex-col group relative overflow-hidden"
                                >
                                    {prod.discount > 0 && (
                                        <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-red-500 text-white text-[10px] lg:text-xs font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded z-10 shadow-sm">
                                            {prod.discount}% OFF
                                        </div>
                                    )}

                                    <div className="h-28 lg:h-40 w-full mb-3 lg:mb-4 rounded-lg lg:rounded-xl bg-slate-50 flex items-center justify-center p-2 lg:p-4 group-hover:bg-slate-100 transition-colors">
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

                                        <div className="flex items-center justify-between gap-2 mb-2 lg:mb-4">
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
                                                item.productId?._id === prod._id
                                        ) ? (
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
                                                    handleAddToCart(e, prod._id)
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
                                <FaSearch className="text-3xl text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">
                                No products found
                            </h3>
                            <p className="text-slate-500 max-w-sm">
                                Try a different keyword or remove the category
                                filter to explore more items.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {query && (
                                    <button
                                        onClick={clearSearchQuery}
                                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                                    >
                                        Clear search
                                    </button>
                                )}
                                {categoryQuery && (
                                    <button
                                        onClick={clearCategoryFilter}
                                        className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-colors"
                                    >
                                        Clear category
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {showFilters && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setShowFilters(false)}
                    ></div>
                )}

                <div
                    className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:w-72 md:translate-x-0 md:shadow-none md:bg-transparent md:z-0 md:block md:order-1 ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="h-full flex flex-col bg-white md:bg-transparent md:rounded-2xl md:border md:border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 md:bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <FaFilter className="text-indigo-600" /> Filters
                            </h3>
                            <button
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors md:hidden"
                                onClick={() => setShowFilters(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-grow">
                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Sort By
                                </h4>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortBy === "default" ? "border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                                        >
                                            {sortBy === "default" && (
                                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="sort"
                                            className="hidden"
                                            checked={sortBy === "default"}
                                            onChange={() =>
                                                setSortBy("default")
                                            }
                                        />
                                        <span
                                            className={`text-sm ${sortBy === "default" ? "font-semibold text-indigo-900" : "text-slate-600 group-hover:text-slate-800"}`}
                                        >
                                            Relevance
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortBy === "price_low" ? "border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                                        >
                                            {sortBy === "price_low" && (
                                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="sort"
                                            className="hidden"
                                            checked={sortBy === "price_low"}
                                            onChange={() =>
                                                setSortBy("price_low")
                                            }
                                        />
                                        <span
                                            className={`text-sm ${sortBy === "price_low" ? "font-semibold text-indigo-900" : "text-slate-600 group-hover:text-slate-800"}`}
                                        >
                                            Price: Low to High
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortBy === "price_high" ? "border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                                        >
                                            {sortBy === "price_high" && (
                                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="sort"
                                            className="hidden"
                                            checked={sortBy === "price_high"}
                                            onChange={() =>
                                                setSortBy("price_high")
                                            }
                                        />
                                        <span
                                            className={`text-sm ${sortBy === "price_high" ? "font-semibold text-indigo-900" : "text-slate-600 group-hover:text-slate-800"}`}
                                        >
                                            Price: High to Low
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                                    Categories
                                    {categoryQuery && (
                                        <button
                                            onClick={clearCategoryFilter}
                                            className="text-xs text-indigo-600 font-semibold normal-case hover:underline"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => {
                                        const isSelected =
                                            categoryQuery === cat._id;
                                        return (
                                            <label
                                                key={cat._id}
                                                className={`cursor-pointer p-3 rounded-2xl border transition-colors ${isSelected ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleCategoryClick(
                                                            cat._id
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center p-2 ${isSelected ? "bg-indigo-600/10" : "bg-slate-50"}`}
                                                    >
                                                        <img
                                                            src={cat.image}
                                                            className="w-full h-full object-contain"
                                                            alt={cat.name}
                                                        />
                                                    </div>
                                                    <span
                                                        className={`text-xs font-semibold leading-tight line-clamp-2 ${isSelected ? "text-indigo-900" : "text-slate-700"}`}
                                                    >
                                                        {cat.name}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 md:hidden bg-slate-50">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
