import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OTPVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.email;
    const inputRef = useRef([]);

    const validDetails = data.every((i) => i);

    useEffect(() => {
        if (inputRef.current[0]) {
            inputRef.current[0].focus();
        }

        if (!email) {
            navigate("/forgot-password");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...ApiEndpoints.verify_forgot_password_otp,
                data: {
                    email: email,
                    otp: data.join(""),
                },
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                setData(["", "", "", "", "", ""]);
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: email,
                    },
                });
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
                    <h1 className="font-extrabold text-3xl text-slate-800 mb-2">Check Your Email</h1>
                    <p className="text-slate-500">
                        We've sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 mt-2"
                >
                    <div className="flex justify-between gap-2 sm:gap-4">
                        {data.map((value, index) => {
                            return (
                                <input
                                    key={"otp" + index}
                                    ref={(ref) => {
                                        inputRef.current[index] = ref;
                                        return ref;
                                    }}
                                    type="text"
                                    className="w-12 h-14 sm:w-14 sm:h-16 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-center font-bold text-xl text-slate-700 transition-all shadow-sm"
                                    name="otp"
                                    maxLength={1}
                                    inputMode="numeric"
                                    value={data[index]}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        const newVal = rawVal.replace(
                                            /[^0-9]/g,
                                            ""
                                        );
                                        const newData = [...data];
                                        newData[index] = newVal;
                                        setData(newData);

                                        if (newVal && index < 5) {
                                            inputRef.current[
                                                index + 1
                                            ].focus();
                                        }
                                        else if (
                                            !newVal &&
                                            rawVal === "" &&
                                            index > 0
                                        ) {
                                            inputRef.current[
                                                index - 1
                                            ].focus();
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const paste = e.clipboardData
                                            .getData("text")
                                            .replace(/[^0-9]/g, "");
                                        if (paste) {
                                            const arr = paste
                                                .split("")
                                                .slice(0, 6);
                                            const newData = [...data];
                                            arr.forEach((char, idx) => {
                                                newData[idx] = char;
                                            });
                                            setData(newData);
                                            const lastIdx = arr.length - 1;
                                            if (inputRef.current[lastIdx]) {
                                                inputRef.current[
                                                    lastIdx
                                                ].focus();
                                            }
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!validDetails}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                            validDetails
                                ? "bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Verify Code
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-2">
                    Didn't receive the code?{" "}
                    <Link
                        to={"/forgot-password"}
                        className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        Resend
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default OTPVerification;
