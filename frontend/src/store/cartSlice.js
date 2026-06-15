import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        updateCartItem: (state, action) => {
            const index = state.cart.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.cart[index].quantity = action.payload.qty;
            }
        },
        removeCartItem: (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        }
    }
});

export const { setCart, addToCart, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
