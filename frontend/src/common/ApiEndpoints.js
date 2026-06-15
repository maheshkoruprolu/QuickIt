export const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ApiEndpoints = {
    register: {
        url: "/api/user/register",
        method: "post",
    },
    login: {
        url: "/api/user/login",
        method: "post",
    },
    logout: {
        url: "/api/user/logout",
        method: "get",
    },
    forgot_password: {
        url: "/api/user/forgot-password",
        method: "put",
    },
    verify_forgot_password_otp: {
        url: "/api/user/verify-forgot-password-otp",
        method: "put",
    },
    reset_password: {
        url: "/api/user/reset-password",
        method: "put",
    },
    refresh_token: {
        url: "/api/user/refresh-token",
        method: "post",
    },
    user_details: {
        url: "/api/user/user-details",
        method: "get",
    },
    upload_avatar: {
        url: "/api/user/upload-avatar",
        method: "put",
    },
    upload_image: {
        url: "/api/product/upload-image",
        method: "post",
    },
    update_user: {
        url: "/api/user/update-user",
        method: "put",
    },
    add_category: {
        url: "/api/category/add-category",
        method: "post",
    },
    get_category: {
        url: "/api/category/get-category",
        method: "get",
    },
    update_category: {
        url: "/api/category/update-category",
        method: "put",
    },
    delete_category: {
        url: "/api/category/delete-category",
        method: "delete",
    },
    add_sub_category: {
        url: "/api/sub-category/add-sub-category",
        method: "post",
    },
    get_sub_category: {
        url: "/api/sub-category/get-sub-category",
        method: "get",
    },
    update_sub_category: {
        url: "/api/sub-category/update-sub-category",
        method: "put",
    },
    delete_sub_category: {
        url: "/api/sub-category/delete-sub-category",
        method: "delete",
    },
    add_product: {
        url: "/api/product/add-product",
        method: "post",
    },
    get_product: {
        url: "/api/product/get-product",
        method: "get",
    },
    update_product: {
        url: "/api/product/update-product",
        method: "put",
    },
    delete_product: {
        url: "/api/product/delete-product",
        method: "delete",
    },
    search_product: {
        url: "/api/product/search-product",
        method: "post",
    },
    product_details: {
        url: "/api/product/product-details",
        method: "post",
    },
    add_to_cart: {
        url: "/api/cart/add",
        method: "post",
    },
    get_cart_item: {
        url: "/api/cart/get",
        method: "get",
    },
    update_cart_item: {
        url: "/api/cart/update",
        method: "put",
    },
    delete_cart_item: {
        url: "/api/cart/delete",
        method: "delete",
    },
    add_address: {
        url: "/api/address/add",
        method: "post",
    },
    get_address: {
        url: "/api/address/get",
        method: "get",
    },
    update_address: {
        url: "/api/address/update",
        method: "put",
    },
    delete_address: {
        url: "/api/address/delete",
        method: "delete",
    },
    create_order: {
        url: "/api/order/create",
        method: "post",
    },
    order_history: {
        url: "/api/order/history",
        method: "get",
    },
};

export default ApiEndpoints;
