import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        image: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...ApiEndpoints.get_category,
            });

            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => {
            return {
                ...preve,
                [name]: value,
            };
        });
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("image", file);

            const response = await Axios({
                ...ApiEndpoints.upload_image,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setData((preve) => {
                    return {
                        ...preve,
                        image: response.data.data.url,
                    };
                });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            AxiosToastError(error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleOpenEdit = (cat) => {
        setData({
            id: cat._id,
            name: cat.name,
            image: cat.image,
        });
        setIsEditing(true);
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiCall = isEditing
                ? ApiEndpoints.update_category
                : ApiEndpoints.add_category;
            const response = await Axios({
                ...apiCall,
                data: data,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setOpenModal(false);
                setData({
                    name: "",
                    image: "",
                });
                setIsEditing(false);
                fetchCategories();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?"))
            return;

        try {
            const response = await Axios({
                ...ApiEndpoints.delete_category,
                data: { id },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchCategories();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="p-4 bg-white shadow-sm rounded">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Category Management</h2>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setData({ name: "", image: "" });
                        setOpenModal(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm transition-all"
                >
                    Add Category
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="border rounded p-2 flex flex-col items-center justify-center group relative"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-20 h-20 object-contain mb-2"
                            />
                            <p className="text-sm font-medium text-center">
                                {cat.name}
                            </p>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Category Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">
                                {isEditing
                                    ? "Edit Category"
                                    : "Add New Category"}
                            </h3>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="text-sm">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleOnChange}
                                    className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm">
                                    Category Image
                                </label>
                                <div className="border border-dashed p-4 flex flex-col items-center justify-center bg-blue-50 rounded h-32 relative cursor-pointer hover:border-emerald-500">
                                    {data.image ? (
                                        <img
                                            src={data.image}
                                            alt="preview"
                                            className="h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-sm text-gray-500">
                                            {uploadingImage
                                                ? "Uploading..."
                                                : "Click to Upload Image"}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUploadCategoryImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploadingImage}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded mt-2 transition-all font-medium disabled:opacity-50"
                                disabled={
                                    !data.name || !data.image || uploadingImage
                                }
                            >
                                {isEditing
                                    ? "Update Category"
                                    : "Submit Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;
