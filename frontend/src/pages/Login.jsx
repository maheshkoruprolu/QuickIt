import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
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
        if (isSubmitting || !validDetails) return;

        try {
            setIsSubmitting(true);
            const response = await Axios({
                ...ApiEndpoints.login,
                data: data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem(
                    "accessToken",
                    response.data.data.accessToken
                );
                localStorage.setItem(
                    "refreshToken",
                    response.data.data.refreshToken
                );

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-10">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="font-extrabold text-3xl text-slate-800 mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-slate-500">
                        Log in to QuickIt to continue shopping
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-4"
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-bold text-slate-600 tracking-wide"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-slate-50 p-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="e.g. hello@quickit.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-bold text-slate-600 tracking-wide"
                        >
                            Password
                        </label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 pr-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full bg-transparent p-4 outline-none text-slate-700"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <div
                                onClick={handleShowPassword}
                                className="cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                                {showPassword ? (
                                    <FaRegEye size={20} />
                                ) : (
                                    <FaRegEyeSlash size={20} />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-1">
                            <Link
                                to={"/forgot-password"}
                                className="text-sm text-slate-500 hover:text-emerald-500 font-semibold transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !validDetails}
                        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                            isSubmitting || !validDetails
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30"
                        }`}
                    >
                        {isSubmitting ? "Logging In..." : "Log In"}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-2">
                    Don't have an account yet?{" "}
                    <Link
                        to={"/register"}
                        className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
