import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OTPVerification from "../pages/OTPVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import SavedAddresses from "../pages/SavedAddresses";
import AdminPermision from "../components/isAdmin";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import Product from "../pages/Product";
import CategoryBrowse from "../pages/CategoryBrowse";
import ProductDetails from "../pages/ProductDetails";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "search",
                element: <SearchPage />,
            },
            {
                path: "categories/:id",
                element: <CategoryBrowse />,
            },
            {
                path: "product-details/:id",
                element: <ProductDetails />,
            },
            {
                path: "cart",
                element: <CartPage />,
            },
            {
                path: "checkout",
                element: <CheckoutPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "otp-verification",
                element: <OTPVerification />,
            },
            {
                path: "reset-password",
                element: <ResetPassword />,
            },
            {
                path: "user",
                element: <UserMenuMobile />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />,
                    },
                    {
                        path: "saved-addresses",
                        element: <SavedAddresses />,
                    },
                    {
                        path: "category",
                        element: (
                            <AdminPermision>
                                <Category />
                            </AdminPermision>
                        ),
                    },
                    {
                        path: "sub-category",
                        element: (
                            <AdminPermision>
                                <SubCategory />
                            </AdminPermision>
                        ),
                    },
                    {
                        path: "product",
                        element: (
                            <AdminPermision>
                                <Product />
                            </AdminPermision>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
