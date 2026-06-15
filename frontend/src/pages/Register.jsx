import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
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
        if (isSubmitting || !validDetails) return;

        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm password must be same");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await Axios({
                ...ApiEndpoints.register,
                data: data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                navigate("/login");
            }
            console.log("response", response);
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
                        Create Account
                    </h1>
                    <p className="text-slate-500">
                        Join QuickIt and start shopping today
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-4"
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-bold text-slate-600 tracking-wide"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoFocus={true}
                            className="bg-slate-50 p-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

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
                            placeholder="e.g. john@quickit.com"
                            required
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
                                placeholder="Create a strong password"
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
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-bold text-slate-600 tracking-wide"
                        >
                            Confirm Password
                        </label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 pr-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full bg-transparent p-4 outline-none text-slate-700"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                                required
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
                        disabled={isSubmitting || !validDetails}
                        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                            isSubmitting || !validDetails
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30"
                        }`}
                    >
                        {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-2">
                    Already have an account?{" "}
                    <Link
                        to={"/login"}
                        className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        Log in instead
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
