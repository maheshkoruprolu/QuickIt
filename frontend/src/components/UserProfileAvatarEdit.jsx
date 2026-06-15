import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";

const UserProfileAvatarEdit = ({ close }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const response = await Axios({
                ...ApiEndpoints.upload_avatar,
                data: formData,
            });

            if (response.data.success) {
                toast.success("Profile photo updated successfully!");
                dispatch(
                    setUserDetails({
                        ...user,
                        avatar: response.data.data.avatar,
                    })
                );
                if (close) close();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] p-4 flex items-center justify-center"
            onClick={close}
        >
            <div
                className="bg-white max-w-sm w-full rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>

                <h3 className="font-bold text-xl text-slate-800 mb-6">
                    Update Profile Photo
                </h3>

                <div className="w-28 h-28 bg-indigo-50 border-4 border-white shadow-md ring-4 ring-indigo-50 flex items-center justify-center rounded-full overflow-hidden mb-6 relative group">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaRegUserCircle
                            size={65}
                            className="text-indigo-300"
                        />
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col items-center"
                >
                    <label
                        htmlFor="uploadProfile"
                        className={`w-full text-center font-bold px-6 py-3 rounded-xl cursor-pointer transition-all shadow-md ${loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30"}`}
                    >
                        {loading ? "Uploading..." : "Select New Photo"}
                    </label>
                    <input
                        type="file"
                        id="uploadProfile"
                        className="hidden"
                        onChange={handleUploadAvatar}
                        accept="image/*"
                        disabled={loading}
                    />
                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Supported formats: JPG, PNG, WEBP. Max size: 2MB.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default UserProfileAvatarEdit;
