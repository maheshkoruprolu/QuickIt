import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ApiEndpoints from "../common/ApiEndpoints";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaPlus, FaTrash } from "react-icons/fa";

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    
    const [addressForm, setAddressForm] = useState({
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        mobile: ""
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...ApiEndpoints.get_address
            });
            if (res.data.success) {
                setAddresses(res.data.data.filter(a => a.status));
            }
        } catch (error) {
            console.error("Error fetching addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        });
    };

    const handleOpenEdit = (addr) => {
        setAddressForm({
            _id: addr._id,
            address_line: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            mobile: addr.mobile
        });
        setIsEditing(true);
        setOpenAddModal(true);
    };

    const handleAddOrUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            const apiCall = isEditing ? ApiEndpoints.update_address : ApiEndpoints.add_address;
            const res = await Axios({
                ...apiCall,
                data: addressForm
            });

            if (res.data.success) {
                toast.success(isEditing ? "Address updated successfully" : "Address added successfully");
                setOpenAddModal(false);
                setAddressForm({
                    address_line: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: "",
                    mobile: ""
                });
                setIsEditing(false);
                fetchAddresses();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save address");
        }
    };

    const handleDeleteAddress = async (id) => {
        if(!confirm("Are you sure you want to delete this address?")) return;
        try {
            const res = await Axios({
                ...ApiEndpoints.delete_address,
                data: { _id: id }
            });
            if (res.data.success) {
                toast.success("Address removed");
                fetchAddresses();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove address");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Saved Addresses</h2>
                    <p className="text-slate-500 mt-1">Manage your delivery locations</p>
                </div>
                <button 
                    onClick={() => {
                        setIsEditing(false);
                        setAddressForm({ address_line: "", city: "", state: "", pincode: "", country: "", mobile: "" });
                        setOpenAddModal(true);
                    }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
                >
                    <FaPlus size={14} /> Add New
                </button>
            </div>

            {loading ? (
                <div className="text-slate-500 flex justify-center py-10">Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FaMapMarkerAlt className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">You have no saved addresses yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                        <div key={addr._id} className="border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleOpenEdit(addr)}
                                    className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-semibold"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteAddress(addr._id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete Address"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="flex gap-3 mb-2">
                                <FaMapMarkerAlt className="text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-800">{addr.address_line}</p>
                                    <p className="text-slate-600 mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="text-slate-500 text-sm mt-1">{addr.country}</p>
                                    <div className="mt-4 inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                                        Mobile: {addr.mobile}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Address Modal */}
            {openAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-xl text-slate-800">{isEditing ? "Edit Address" : "Add New Address"}</h3>
                            <button onClick={() => setOpenAddModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 w-8 h-8 rounded-full flex justify-center items-center">✕</button>
                        </div>
                        <form onSubmit={handleAddOrUpdateAddress} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Address Line</label>
                                <input required name="address_line" value={addressForm.address_line} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">City</label>
                                    <input required name="city" value={addressForm.city} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">State</label>
                                    <input required name="state" value={addressForm.state} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Pincode</label>
                                    <input required name="pincode" value={addressForm.pincode} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Country</label>
                                    <input required name="country" value={addressForm.country} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Mobile Number</label>
                                <input required type="number" name="mobile" value={addressForm.mobile} onChange={handleFormChange} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50" />
                            </div>
                            
                            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-emerald-500 transition-colors shadow-lg">
                                {isEditing ? "Update Address" : "Save Address"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedAddresses;
