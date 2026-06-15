import React, { useEffect, useState } from "react";
import {
    FaRegUserCircle,
    FaEdit,
    FaPhoneAlt,
    FaEnvelope,
    FaUserTag,
    FaShieldAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";

const formatValue = (value, fallback = "Not provided") => {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    return value;
};

const Profile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [openAvatarEdit, setOpenAvatarEdit] = useState(false);

    // States for editing personal info
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [infoData, setInfoData] = useState({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
    });
    const [infoLoading, setInfoLoading] = useState(false);

    useEffect(() => {
        setInfoData({
            name: user.name || "",
            mobile: user.mobile || "",
            email: user.email || "",
        });
    }, [user.name, user.mobile, user.email]);

    // States for editing password
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleInfoChange = (e) => {
        setInfoData({ ...infoData, [e.target.name]: e.target.value });
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            setInfoLoading(true);
            const response = await Axios({
                ...ApiEndpoints.update_user,
                data: infoData,
            });

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                const userData = await fetchUserDetails();
                dispatch(setUserDetails(userData.data));
                setIsEditingInfo(false);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setInfoLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!passwordData) return toast.error("Please enter a new password");
        try {
            setPasswordLoading(true);
            const response = await Axios({
                ...ApiEndpoints.update_user,
                data: { password: passwordData },
            });

            if (response.data.success) {
                toast.success("Password updated successfully!");
                setIsEditingPassword(false);
                setPasswordData("");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                    <FaUserTag className="text-indigo-600" /> Account Overview
                </h2>
                <p className="text-slate-500 mt-2">
                    Keep your personal details, security settings, and profile
                    photo up to date.
                </p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center gap-6 shadow-lg shadow-indigo-600/20 mb-8 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div
                    className="relative group cursor-pointer"
                    onClick={() => setOpenAvatarEdit(true)}
                >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaRegUserCircle
                                size={60}
                                className="text-slate-300"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <FaEdit className="text-white text-2xl" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-lg z-30 border-2 border-white hover:bg-emerald-600 transition-colors">
                        <FaEdit size={14} />
                    </button>
                </div>

                <div className="text-center sm:text-left z-10 flex-grow w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div>
                            <h3 className="text-3xl font-bold tracking-tight mb-1">
                                {user.name || "Add Your Name"}
                            </h3>
                            <p className="text-indigo-100 font-medium bg-white/10 inline-block px-3 py-1 rounded-full text-sm">
                                {user.role || "Customer"} Account
                            </p>
                        </div>
                        <div className="sm:ml-auto grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-100">
                                    Email
                                </p>
                                <p className="text-sm font-semibold mt-1 truncate max-w-[180px]">
                                    {formatValue(user.email)}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-100">
                                    Mobile
                                </p>
                                <p className="text-sm font-semibold mt-1">
                                    {formatValue(user.mobile)}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10 col-span-2 sm:col-span-1">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-100">
                                    Status
                                </p>
                                <p className="text-sm font-semibold mt-1">
                                    {formatValue(user.status, "Active")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information Form/Display */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">
                            Personal Information
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Update your name, email address, and mobile number.
                        </p>
                    </div>
                    {!isEditingInfo ? (
                        <button
                            onClick={() => setIsEditingInfo(true)}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditingInfo(false)}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleUpdateInfo} className="p-6 grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                                <FaRegUserCircle className="text-indigo-400" />{" "}
                                Full Name
                            </label>
                            {isEditingInfo ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={infoData.name}
                                    onChange={handleInfoChange}
                                    className="w-full bg-white border border-indigo-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            ) : (
                                <div className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium">
                                    {formatValue(user.name)}
                                </div>
                            )}
                        </div>

                        {/* Mobile Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                                <FaPhoneAlt className="text-indigo-400" />{" "}
                                Mobile Number
                            </label>
                            {isEditingInfo ? (
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    name="mobile"
                                    value={infoData.mobile}
                                    onChange={handleInfoChange}
                                    placeholder="e.g. 9876543210"
                                    className="w-full bg-white border border-indigo-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            ) : (
                                <div className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium">
                                    {formatValue(user.mobile)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                            <FaEnvelope className="text-indigo-400" /> Email
                            Address
                        </label>
                        {isEditingInfo ? (
                            <input
                                type="email"
                                name="email"
                                value={infoData.email}
                                onChange={handleInfoChange}
                                className="w-full bg-white border border-indigo-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                required
                            />
                        ) : (
                            <div className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium">
                                {formatValue(user.email)}
                            </div>
                        )}
                    </div>

                    {isEditingInfo && (
                        <div className="flex justify-end mt-2">
                            <button
                                disabled={infoLoading}
                                type="submit"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md disabled:bg-slate-300"
                            >
                                {infoLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-emerald-500" />
                        <h3 className="font-bold text-lg text-slate-800">
                            Security
                        </h3>
                    </div>
                    {isEditingPassword && (
                        <button
                            onClick={() => setIsEditingPassword(false)}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                        <h4 className="font-semibold text-slate-800">
                            Account Password
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                            Regularly update your password to keep your account
                            secure.
                        </p>

                        {isEditingPassword && (
                            <form
                                onSubmit={handleUpdatePassword}
                                className="mt-4 flex flex-col sm:flex-row gap-3"
                            >
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={passwordData}
                                    onChange={(e) =>
                                        setPasswordData(e.target.value)
                                    }
                                    className="w-full sm:max-w-xs bg-white border border-indigo-200 text-slate-800 px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                                <button
                                    disabled={passwordLoading}
                                    type="submit"
                                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors shadow-md disabled:bg-slate-300 whitespace-nowrap"
                                >
                                    {passwordLoading
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>
                            </form>
                        )}
                    </div>

                    {!isEditingPassword && (
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors whitespace-nowrap"
                        >
                            Change Password
                        </button>
                    )}
                </div>
            </div>

            {openAvatarEdit && (
                <UserProfileAvatarEdit
                    close={() => {
                        setOpenAvatarEdit(false);
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
