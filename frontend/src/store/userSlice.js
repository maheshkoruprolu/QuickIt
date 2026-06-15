import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    last_login_date: "",
    mobile: "",
    verify_email: "",
    status: "",
    address_details: [],
    orderHistory: [],
    shopping_cart: [],
    role: "",
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id;
            state.name = action.payload?.name;
            state.email = action.payload?.email;
            state.avatar = action.payload?.avatar;
            state.mobile = action.payload?.mobile;
            state.last_login_date = action.payload?.last_login_date;
            state.verify_email = action.payload?.verify_email;
            state.status = action.payload?.status;
            state.address_details = action.payload?.address_details;
            state.orderHistory = action.payload?.orderHistory;
            state.role = action.payload?.role;
            state.shopping_cart = action.payload?.shopping_cart;
        },
        logout: (state, action) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.avatar = "";
            state.last_login_date = "";
            state.mobile = "";
            state.verify_email = "";
            state.status = "";
            state.address_details = [];
            state.orderHistory = [];
            state.shopping_cart = [];
            state.role = "";
        },
    },
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
