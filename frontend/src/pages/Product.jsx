import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import ApiEndpoints from '../common/ApiEndpoints';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const initialData = {
        name: "",
        image: [],
        categoryId: [],
        subCategory: [],
        unit: "",
        stock: 0,
        price: 0,
        discount: 0,
        description: "",
        publish: true,
    };
    const [data, setData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...ApiEndpoints.get_product
            });

            if (response.data.success) {
                setProducts(response.data.data);
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
                ...ApiEndpoints.get_category
            });
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await Axios({
                ...ApiEndpoints.get_sub_category
            });
            if (response.data.success) {
                setSubCategories(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubCategories();
    }, []);

    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((preve) => {
            return {
                ...preve,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const handleCategorySelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        if (!data.categoryId.includes(selectedId)) {
            setData((preve) => ({
                ...preve,
                categoryId: [...preve.categoryId, selectedId]
            }));
        }
    };

    const removeCategorySelect = (idToRemove) => {
        setData((preve) => ({
            ...preve,
            categoryId: preve.categoryId.filter(id => id !== idToRemove)
        }));
    };

    const handleSubCategorySelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        if (!data.subCategory.includes(selectedId)) {
            setData((preve) => ({
                ...preve,
                subCategory: [...preve.subCategory, selectedId]
            }));
        }
    };

    const removeSubCategorySelect = (idToRemove) => {
        setData((preve) => ({
            ...preve,
            subCategory: preve.subCategory.filter(id => id !== idToRemove)
        }));
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await Axios({
                ...ApiEndpoints.upload_image,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setData((preve) => ({
                    ...preve,
                    image: [...preve.image, response.data.data.url]
                }));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            AxiosToastError(error);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setData((preve) => ({
            ...preve,
            image: preve.image.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleOpenEdit = (prod) => {
        setData({
            _id: prod._id,
            name: prod.name,
            image: prod.image || [],
            categoryId: prod.categoryId.map(c => typeof c === 'object' ? c._id : c),
            subCategory: prod.subCategory.map(c => typeof c === 'object' ? c._id : c),
            unit: prod.unit || "",
            stock: prod.stock || 0,
            price: prod.price || 0,
            discount: prod.discount || 0,
            description: prod.description || "",
            publish: prod.publish,
        });
        setIsEditing(true);
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiCall = isEditing ? ApiEndpoints.update_product : ApiEndpoints.add_product;
            const response = await Axios({
                ...apiCall,
                data: data
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setOpenModal(false);
                setData(initialData);
                setIsEditing(false);
                fetchProducts();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await Axios({
                ...ApiEndpoints.delete_product,
                data: { _id: id }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchProducts();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c._id === id);
        return cat ? cat.name : id;
    };

    const getSubCategoryName = (id) => {
        const subCat = subCategories.find(c => c._id === id);
        return subCat ? subCat.name : id;
    };

    return (
        <div className="p-4 bg-white shadow-sm rounded">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Product Management</h2>
                <button 
                    onClick={() => {
                        setIsEditing(false);
                        setData(initialData);
                        setOpenModal(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm transition-all"
                >
                    Add Product
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
                                <th className="p-2 border">Product Name</th>
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Stock</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                    <td className="p-2">
                                        {prod.image && prod.image.length > 0 ? (
                                            <img src={prod.image[0]} alt={prod.name} className="w-12 h-12 object-contain" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-2 font-medium">{prod.name}</td>
                                    <td className="p-2">₹{prod.price}</td>
                                    <td className="p-2">{prod.stock}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded text-xs ${prod.publish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {prod.publish ? 'Published' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenEdit(prod)} 
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(prod._id)} 
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

            {/* Add/Edit Product Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">{isEditing ? "Edit Product" : "Add New Product"}</h3>
                            <button onClick={() => setOpenModal(false)} className="text-gray-500 hover:text-black">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Basic Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Product Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={data.name}
                                        onChange={handleOnChange}
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Description</label>
                                    <textarea 
                                        name="description"
                                        value={data.description}
                                        onChange={handleOnChange}
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500 resize-none h-[42px]"
                                    />
                                </div>
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Price</label>
                                    <input 
                                        type="number" 
                                        name="price"
                                        value={data.price}
                                        onChange={handleOnChange}
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Discount (%)</label>
                                    <input 
                                        type="number" 
                                        name="discount"
                                        value={data.discount}
                                        onChange={handleOnChange}
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Stock</label>
                                    <input 
                                        type="number" 
                                        name="stock"
                                        value={data.stock}
                                        onChange={handleOnChange}
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Unit</label>
                                    <input 
                                        type="text" 
                                        name="unit"
                                        value={data.unit}
                                        onChange={handleOnChange}
                                        placeholder="e.g. 1kg, 1pc"
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Select Category</label>
                                    <select 
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                        onChange={handleCategorySelect}
                                        value=""
                                    >
                                        <option value="" disabled>Select category</option>
                                        {categories.map((cat, index) => (
                                            <option value={cat._id} key={index}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {data.categoryId.map((id, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-gray-100 border px-2 py-1 rounded text-xs">
                                                {getCategoryName(id)}
                                                <button type="button" onClick={() => removeCategorySelect(id)} className="text-red-500">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Select Sub Category</label>
                                    <select 
                                        className="bg-blue-50 border p-2 rounded outline-none focus-within:border-emerald-500"
                                        onChange={handleSubCategorySelect}
                                        value=""
                                    >
                                        <option value="" disabled>Select sub category</option>
                                        {subCategories.map((sub, index) => (
                                            <option value={sub._id} key={index}>{sub.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {data.subCategory.map((id, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-gray-100 border px-2 py-1 rounded text-xs">
                                                {getSubCategoryName(id)}
                                                <button type="button" onClick={() => removeSubCategorySelect(id)} className="text-red-500">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Product Images</label>
                                <div className="flex gap-2 flex-wrap">
                                    {data.image.map((imgUrl, index) => (
                                        <div key={index} className="w-24 h-24 border rounded relative group">
                                            <img src={imgUrl} alt={`Product ${index}`} className="w-full h-full object-contain" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <div className="w-24 h-24 border border-dashed flex flex-col items-center justify-center bg-blue-50 rounded relative cursor-pointer hover:border-emerald-500">
                                        <div className="text-center text-xs text-gray-500">
                                            {uploadingImage ? 'Uploading...' : 'Add Image'}
                                        </div>
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadImage}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={uploadingImage}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox" 
                                    id="publish"
                                    name="publish"
                                    checked={data.publish}
                                    onChange={handleOnChange}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="publish" className="text-sm cursor-pointer">Publish Product immediately</label>
                            </div>

                            <button 
                                type="submit" 
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded mt-2 transition-all font-medium disabled:opacity-50"
                                disabled={!data.name || data.price === 0 || uploadingImage}
                            >
                                {isEditing ? "Update Product" : "Submit Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Product;
