import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { setCart } from "./store/cartSlice";
import { useDispatch } from "react-redux";
import fetchCartItems from "./utils/fetchCartItems";

function App() {
    const dispatch = useDispatch();

    const fetchUser = async () => {
        const userData = await fetchUserDetails();
        if (userData?.data) {
            dispatch(setUserDetails(userData.data));
        }
    };

    const fetchCart = async () => {
        const cartData = await fetchCartItems();
        if (cartData?.data) {
            dispatch(setCart(cartData.data));
        }
    };

    useEffect(() => {
        fetchUser();
        fetchCart();
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-[77vh] pb-16 lg:pb-0">
                <Outlet />
            </main>
            <Footer />
            <MobileNav />
            <Toaster />
        </>
    );
}

export default App;
