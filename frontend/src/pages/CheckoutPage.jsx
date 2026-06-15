import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import ApiEndpoints from '../common/ApiEndpoints';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const cart = useSelector(state => state?.cart?.cart || []);
    const user = useSelector(state => state?.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [addressForm, setAddressForm] = useState({
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        mobile: ""
    });

    useEffect(() => {
        if (!user?._id) {
            navigate("/login");
            return;
        }
        
        if (cart.length === 0) {
            navigate("/");
            return;
        }

        fetchAddresses();
    }, [user, cart]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...ApiEndpoints.get_address
            });
            if (res.data.success) {
                // Filter out disabled/deleted addresses
                const activeAddresses = res.data.data.filter(a => a.status);
                setAddresses(activeAddresses);
                if (activeAddresses.length > 0) {
                    setSelectedAddress(activeAddresses[0]._id);
                }
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

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await Axios({
                ...ApiEndpoints.add_address,
                data: addressForm
            });

            if (res.data.success) {
                toast.success("Address added successfully");
                setOpenAddModal(false);
                setAddressForm({
                    address_line: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: "",
                    mobile: ""
                });
                fetchAddresses();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        const totalPrice = cart.reduce((acc, curr) => acc + ((curr.productId?.price || 0) * curr.quantity), 0);

        try {
            setLoading(true);
            const res = await Axios({
                ...ApiEndpoints.create_order,
                data: {
                    addressId: selectedAddress,
                    subTotal: totalPrice,
                    total: totalPrice
                }
            });

            if (res.data.success) {
                toast.success("Order placed successfully!");
                // Clear cart locally since it was cleared on the backend
                dispatch({ type: 'cart/clearCart' });
                navigate("/dashboard/myorders");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cart.reduce((acc, curr) => acc + ((curr.productId?.price || 0) * curr.quantity), 0);

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Address Selection */}
                <div className="flex-grow">
                    <div className="bg-white p-6 rounded shadow-sm border mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Delivery Address</h2>
                            <button 
                                onClick={() => setOpenAddModal(true)}
                                className="text-emerald-500 font-medium hover:underline"
                            >
                                + Add New Address
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading addresses...</p>
                        ) : addresses.length === 0 ? (
                            <div className="text-gray-500 py-4 text-center border border-dashed rounded">
                                No saved addresses found. Please add an address to continue.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {addresses.map(addr => (
                                    <label 
                                        key={addr._id} 
                                        className={`border rounded p-4 cursor-pointer flex gap-4 ${selectedAddress === addr._id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-orange-300'}`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="address" 
                                            value={addr._id}
                                            checked={selectedAddress === addr._id}
                                            onChange={() => setSelectedAddress(addr._id)}
                                            className="mt-1 w-4 h-4 text-emerald-500"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{addr.address_line}</p>
                                            <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="text-gray-600">{addr.country}</p>
                                            <p className="text-gray-800 font-medium mt-1">Mobile: {addr.mobile}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-white p-6 rounded shadow-sm border sticky top-24">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Order Summary</h3>
                        
                        <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 truncate mr-2">{item.quantity} x {item.productId?.name}</span>
                                    <span className="font-medium">₹{item.quantity * (item.productId?.price || 0)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                            <span>Total Pay</span>
                            <span>₹{totalPrice}</span>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-emerald-500 text-white font-bold py-3 rounded hover:bg-emerald-600 transition-colors"
                        >
                            Place Order & Pay
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {openAddModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Add New Address</h3>
                            <button onClick={() => setOpenAddModal(false)} className="text-gray-500 hover:text-black">✕</button>
                        </div>
                        <form onSubmit={handleAddAddress} className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm">Address Line</label>
                                <input required name="address_line" value={addressForm.address_line} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm">City</label>
                                    <input required name="city" value={addressForm.city} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-sm">State</label>
                                    <input required name="state" value={addressForm.state} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm">Pincode</label>
                                    <input required name="pincode" value={addressForm.pincode} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-sm">Country</label>
                                    <input required name="country" value={addressForm.country} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm">Mobile Number</label>
                                <input required type="number" name="mobile" value={addressForm.mobile} onChange={handleFormChange} className="w-full border p-2 rounded outline-none focus:border-emerald-500" />
                            </div>
                            
                            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-2 rounded mt-4">Save Address</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
