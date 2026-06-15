import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaThLarge,
    FaShoppingCart,
    FaUserCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const MobileNav = () => {
    const cart = useSelector((state) => state?.cart?.cart || []);
    const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 z-[999] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-1">
            <div className="flex justify-around items-center h-14">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-500"}`
                    }
                >
                    <FaHome size={20} />
                    <span className="text-[10px] font-semibold">Home</span>
                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-500"}`
                    }
                >
                    <FaThLarge size={20} />
                    <span className="text-[10px] font-semibold">
                        Categories
                    </span>
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-500"}`
                    }
                >
                    <div className="relative">
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-bold h-[15px] min-w-[15px] px-[4px] rounded-full flex items-center justify-center border border-white">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-semibold">Cart</span>
                </NavLink>

                <NavLink
                    to="/user"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-500"}`
                    }
                >
                    <FaUserCircle size={20} />
                    <span className="text-[10px] font-semibold">Account</span>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileNav;
