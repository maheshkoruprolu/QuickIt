import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const SubCategory = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        image: "",
        categoryId: [], // Array to hold selected category IDs
    });

    const [isEditing, setIsEditing] = useState(false);

    const fetchSubCategories = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...ApiEndpoints.get_sub_category,
            });

            if (response.data.success) {
                setSubCategories(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await Axios({
                ...ApiEndpoints.get_category,
            });

            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchSubCategories();
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

    const handleCategorySelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        // Add to array if not already present
        if (!data.categoryId.includes(selectedId)) {
            setData((preve) => ({
                ...preve,
                categoryId: [...preve.categoryId, selectedId],
            }));
        }
    };

    const removeCategorySelect = (idToRemove) => {
        setData((preve) => ({
            ...preve,
            categoryId: preve.categoryId.filter((id) => id !== idToRemove),
        }));
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

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
                setData((preve) => ({
                    ...preve,
                    image: response.data.data.url,
                }));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            AxiosToastError(error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleOpenEdit = (sub) => {
        setData({
            id: sub._id,
            name: sub.name,
            image: sub.image,
            categoryId: sub.categoryId.map((c) => c._id),
        });
        setIsEditing(true);
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiCall = isEditing
                ? ApiEndpoints.update_sub_category
                : ApiEndpoints.add_sub_category;
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
                    categoryId: [],
                });
                setIsEditing(false);
                fetchSubCategories();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this sub category?"
            )
        )
            return;

        try {
            const response = await Axios({
                ...ApiEndpoints.delete_sub_category,
                data: { id },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchSubCategories();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    // Helper to get category name by ID
    const getCategoryName = (id) => {
        const cat = categories.find((c) => c._id === id);
        return cat ? cat.name : id;
    };

    return (
        <div className="p-4 bg-white shadow-sm rounded">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Sub Category Management
                </h2>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setData({ name: "", image: "", categoryId: [] });
                        setOpenModal(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm transition-all"
                >
                    Add Sub Category
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Image</th>
                                <th className="p-2 border">
                                    Sub Category Name
                                </th>
                                <th className="p-2 border">
                                    Linked Categories
                                </th>
                                <th className="p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategories.map((sub, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 border-b"
                                >
                                    <td className="p-2">
                                        <img
                                            src={sub.image}
                                            alt={sub.name}
                                            className="w-12 h-12 object-contain"
                                        />
                                    </td>
                                    <td className="p-2 font-medium">
                                        {sub.name}
                                    </td>
                                    <td className="p-2">
                                        <div className="flex gap-1 flex-wrap">
                                            {sub.categoryId.map((cat, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleOpenEdit(sub)
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(sub._id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Sub Category Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">
                                {isEditing
                                    ? "Edit Sub Category"
                                    : "Add New Sub Category"}
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
                                <label className="text-sm">
                                    Sub Category Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleOnChange}
                                    className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    placeholder="Enter sub category name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Link Category</label>
                                <select
                                    className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    onChange={handleCategorySelect}
                                    value=""
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    {categories.map((cat, index) => (
                                        <option value={cat._id} key={index}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.categoryId.map((id, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 bg-white border shadow-sm px-2 py-1 rounded text-sm"
                                        >
                                            {getCategoryName(id)}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCategorySelect(id)
                                                }
                                                className="text-red-500 hover:text-red-700 ml-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm">
                                    Sub Category Image
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
                                        onChange={handleUploadImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploadingImage}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded mt-2 transition-all font-medium disabled:opacity-50"
                                disabled={
                                    !data.name ||
                                    !data.image ||
                                    data.categoryId.length === 0 ||
                                    uploadingImage
                                }
                            >
                                {isEditing
                                    ? "Update Sub Category"
                                    : "Submit Sub Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubCategory;
