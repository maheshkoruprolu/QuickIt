import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

        if (loading) return; // Prevent multiple submissions

        setLoading(true);
        try {
            const response = await Axios({
                ...ApiEndpoints.forgot_password,
                data: data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/otp-verification", { state: data });
                setData({
                    email: "",
                });
            }
            console.log("response", response);
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-10">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="font-extrabold text-3xl text-slate-800 mb-2">Forgot Password</h1>
                    <p className="text-slate-500">Enter your email to receive a recovery code</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-4"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-600 tracking-wide">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="bg-slate-50 p-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="e.g. john@quickit.com"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!validDetails || loading}
                        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                            validDetails && !loading
                                ? "bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-2">
                    Remember your password?{" "}
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

export default ForgotPassword;
