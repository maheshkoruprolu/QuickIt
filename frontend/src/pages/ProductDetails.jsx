import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import ApiEndpoints from '../common/ApiEndpoints';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state?.cart?.cart || []);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await Axios({
                    ...ApiEndpoints.product_details,
                    data: { id }
                });

                if (response.data.success) {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    if (loading) return <div className="py-20 text-center">Loading product...</div>;
    if (!product) return <div className="py-20 text-center text-red-500">Product not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 lg:p-10 flex flex-col md:flex-row gap-10 lg:gap-16">
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="w-full h-[400px] lg:h-[500px] bg-slate-50 rounded-2xl flex items-center justify-center p-8 group relative overflow-hidden">
                        {product.image && product.image[selectedImage] ? (
                            <img src={product.image[selectedImage]} alt={product.name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="text-slate-400">No Image Available</div>
                        )}
                        {product.discount > 0 && (
                            <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                {product.discount}% OFF
                            </div>
                        )}
                    </div>
                    {product.image && product.image.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-2">
                            {product.image.map((img, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-xl flex-shrink-0 p-2 transition-all duration-300 ${selectedImage === index ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border border-slate-200 hover:border-orange-300'}`}
                                >
                                    <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-contain mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex gap-2 mb-4">
                        {product.categoryId.map(cat => (
                            <span key={cat._id} className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3 leading-tight">{product.name}</h1>
                    <p className="text-slate-500 mb-6 font-medium text-lg">{product.unit}</p>

                    <div className="flex items-center gap-6 mb-8 bg-slate-50 p-6 rounded-2xl">
                        <span className="text-5xl font-extrabold text-slate-900">₹{product.price}</span>
                        {product.discount > 0 && (
                            <div className="flex flex-col">
                                <span className="text-slate-400 line-through text-lg">
                                    ₹{Math.round(product.price * (1 + product.discount/100))}
                                </span>
                                <span className="text-green-600 font-bold">You save ₹{Math.round(product.price * (1 + product.discount/100)) - product.price}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-10">
                        {cart.some(item => item.productId?._id === product._id) ? (
                            <button 
                                onClick={() => navigate("/cart")}
                                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors text-lg shadow-lg flex items-center justify-center gap-3"
                            >
                                Go to Cart
                            </button>
                        ) : (
                            <button 
                                onClick={async () => {
                                    try {
                                        const res = await Axios({ ...ApiEndpoints.add_to_cart, data: { productId: product._id } });
                                        if(res.data.success) {
                                            toast.success("Added to cart");
                                            const cartData = await Axios({...ApiEndpoints.get_cart_item});
                                            if (cartData.data.success) {
                                                dispatch(setCart(cartData.data.data));
                                            }
                                        }
                                    } catch (error) {
                                        AxiosToastError(error);
                                    }
                                }}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-colors text-lg shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-3"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>

                    <div className="flex-grow">
                        <h3 className="font-bold text-xl mb-4 text-slate-800">Product Description</h3>
                        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                            {product.description || "No description provided."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
