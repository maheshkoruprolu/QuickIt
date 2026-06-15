import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { logout } from "../store/userSlice";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const UserMenu = ({ close }) => {
    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCloseAfterClick = () => {
        if (close) {
            close();
        }
    };

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...ApiEndpoints.logout,
            });

            if (response?.data?.success) {
                handleCloseAfterClick();
                dispatch(logout());
                localStorage.clear();
                toast.success(response?.data?.message);
                navigate("/");
            }
        } catch (err) {
            AxiosToastError(err);
        }
    };

    const linkClass = ({ isActive }) =>
        `block px-4 py-2.5 rounded-xl transition-all ${
            isActive
                ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm"
                : "hover:bg-slate-50 hover:text-slate-900"
        }`;

    const adminLinkClass = ({ isActive }) =>
        `block px-4 py-2.5 rounded-xl transition-all ${
            isActive
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "hover:bg-slate-50 hover:text-slate-900"
        }`;

    return (
        <div
            className={`bg-white ${close ? "" : "rounded-3xl shadow-sm border border-slate-100 p-6"}`}
        >
            <div className="mb-6">
                <div className="font-extrabold text-xl text-slate-800 mb-3">
                    My Account
                </div>
                <Link
                    to={"/dashboard/profile"}
                    onClick={handleCloseAfterClick}
                    className="flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 rounded-[1.4rem] shadow-lg hover:shadow-xl transition-all group overflow-hidden relative"
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-lg group-hover:bg-white/20 transition-all"></div>

                    <span className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-1">
                        Welcome
                    </span>
                    <span className="text-white font-bold text-lg truncate relative z-10">
                        {user.name || user.mobile || "User"}
                    </span>
                    <span className="text-indigo-200 text-xs mt-2 font-medium underline decoration-indigo-400/50 underline-offset-2">
                        View Full Profile
                    </span>
                </Link>
            </div>

            <Divider />

            <div className="grid text-[15px] font-medium gap-2 mt-4">
                {user.role === "Admin" && (
                    <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                            Admin Panel
                        </p>
                        <NavLink
                            to={"/dashboard/category"}
                            className={adminLinkClass}
                            onClick={handleCloseAfterClick}
                        >
                            Categories
                        </NavLink>
                        <NavLink
                            to={"/dashboard/sub-category"}
                            className={adminLinkClass}
                            onClick={handleCloseAfterClick}
                        >
                            Sub Categories
                        </NavLink>
                        <NavLink
                            to={"/dashboard/product"}
                            className={adminLinkClass}
                            onClick={handleCloseAfterClick}
                        >
                            Products
                        </NavLink>
                    </div>
                )}

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                    Your Details
                </p>
                <NavLink
                    to={"/dashboard/myorders"}
                    className={linkClass}
                    onClick={handleCloseAfterClick}
                >
                    My Orders
                </NavLink>
                <NavLink
                    to={"/dashboard/saved-addresses"}
                    className={linkClass}
                    onClick={handleCloseAfterClick}
                >
                    Saved Addresses
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2.5 mt-4 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl cursor-pointer transition-all font-bold"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserMenu;
