import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [data, setData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.email;

    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    const validDetails = Object.values(data).every((i) => i);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New Password and Confirm Password must be same");
            return;
        }

        try {
            const response = await Axios({
                ...ApiEndpoints.reset_password,
                data: {
                    email: email,
                    ...data,
                },
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    newPassword: "",
                    confirmPassword: "",
                });
                navigate("/login");
            }
            console.log("response", response);
        } catch (err) {
            AxiosToastError(err);
        }
    };

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-10">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="font-extrabold text-3xl text-slate-800 mb-2">Create New Password</h1>
                    <p className="text-slate-500">Enter a new strong password below</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-4"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newPassword" className="text-sm font-bold text-slate-600 tracking-wide">New Password</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 pr-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                className="w-full bg-transparent p-4 outline-none text-slate-700"
                                name="newPassword"
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                required
                                autoComplete="new-password"
                            />
                            <div
                                onClick={handleShowNewPassword}
                                className="cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                                {showNewPassword ? (
                                    <FaRegEye size={20} />
                                ) : (
                                    <FaRegEyeSlash size={20} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm font-bold text-slate-600 tracking-wide">Confirm Password</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 pr-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full bg-transparent p-4 outline-none text-slate-700"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your new password"
                                required
                                autoComplete="new-password"
                            />
                            <div
                                onClick={handleShowConfirmPassword}
                                className="cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <FaRegEye size={20} />
                                ) : (
                                    <FaRegEyeSlash size={20} />
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!validDetails}
                        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                            validDetails
                                ? "bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Update Password
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-2">
                    Remembered it?{" "}
                    <Link
                        to={"/login"}
                        className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default ResetPassword;
