import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaBolt } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";

const Header = () => {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user);
    const cart = useSelector((state) => state?.cart?.cart || []);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const redirectToLoginPage = () => navigate("/login");
    const handleCloseUserMenu = () => setOpenUserMenu(false);
    const handleMobileUser = () => {
        if (!user?._id) navigate("/login");
        else navigate("/user");
    };

    // Robust outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setOpenUserMenu(false);
            }
        };

        if (openUserMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openUserMenu]);

    const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const cartTotal = cart.reduce((acc, curr) => acc + ((curr.productId?.price || 0) * curr.quantity), 0);

    return (
        <header className="sticky top-0 z-50 bg-indigo-600 lg:bg-white/90 lg:backdrop-blur-md border-b border-indigo-700 lg:border-slate-200 shadow-md">
            {!(isSearchPage && isMobile) && (
                <div className="container mx-auto flex items-center justify-between px-3 py-2 lg:px-4 lg:py-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-1.5 lg:gap-2 group">
                            <div className="bg-white text-indigo-600 lg:bg-indigo-600 lg:text-white p-1.5 lg:p-2 rounded-lg lg:rounded-xl shadow-sm">
                                <FaBolt size={isMobile ? 18 : 24} />
                            </div>
                            <span className="font-extrabold text-xl lg:text-2xl tracking-tight text-white lg:text-indigo-900">
                                quick<span className="text-emerald-400 lg:text-emerald-500">it</span>
                            </span>
                        </Link>
                    </div>

                    {/* Search (Desktop) */}
                    <div className="hidden lg:block w-full max-w-xl px-6">
                        <Search />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Mobile User Icon */}
                        <button onClick={handleMobileUser} className="text-white lg:text-slate-600 lg:hidden hover:text-emerald-300 transition-colors">
                            <FaUserCircle className="size-6" />
                        </button>

                        {/* Desktop Account */}
                        <div className="hidden lg:flex items-center">
                            {user?._id ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700 font-medium relative z-[51]"
                                        onClick={() => setOpenUserMenu(!openUserMenu)}
                                    >
                                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>Account</span>
                                        {openUserMenu ? <GoTriangleUp /> : <GoTriangleDown />}
                                    </button>
                                    
                                    {openUserMenu && (
                                        <div className="absolute top-14 right-0 z-50">
                                            <div className="bg-white shadow-xl rounded-2xl p-2 min-w-64 border border-slate-100">
                                                <UserMenu close={handleCloseUserMenu} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={redirectToLoginPage}
                                    className="font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 transition-colors"
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button 
                            onClick={() => navigate("/cart")}
                            className="hidden lg:flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-2.5 transition-all duration-300 shadow-md hover:shadow-indigo-600/30"
                        >
                            <div className="relative">
                                <FaShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <div className="font-semibold text-sm border-l border-white/20 pl-3">
                                <span>₹{cartTotal}</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Search */}
            <div className="container mx-auto px-3 pb-3 pt-1 lg:hidden">
                <Search />
            </div>
        </header>
    );
};

export default Header;
