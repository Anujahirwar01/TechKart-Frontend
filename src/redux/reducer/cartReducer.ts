import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartReducerInitialState } from "../../types/reducer-types";
import type { CartItem, ShippingInfo } from "../../types/types";

const getCartFromLocalStorage = (): CartReducerInitialState => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
        try {
            return JSON.parse(savedCart);
        } catch (error) {
            return {
                loading: false,
                cartItems: [],
                subtotal: 0,
                tax: 0,
                shippingCharges: 0,
                discount: 0,
                total: 0,
                shippingInfo: {
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    pinCode: "",
                }
            };
        }
    }
    return {
        loading: false,
        cartItems: [],
        subtotal: 0,
        tax: 0,
        shippingCharges: 0,
        discount: 0,
        total: 0,
        shippingInfo: {
            address: "",
            city: "",
            state: "",
            country: "",
            pinCode: "",
        }
    };
};

const initialState: CartReducerInitialState = getCartFromLocalStorage();

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState, reducers: {
        addToCartRequest: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;
            const index = state.cartItems.findIndex(
                (i) => i.productId === action.payload.productId
            );

            if (index !== -1) {
                if (action.payload.quantity && action.payload.quantity > 0) {
                    state.cartItems[index].quantity = action.payload.quantity;
                } else {
                    state.cartItems[index].quantity += 1;
                }
            } else {
                state.cartItems.push(action.payload);
            }
            state.loading = false;
            localStorage.setItem("cartItems", JSON.stringify(state));
        }
        ,
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload);
            state.loading = false;
            localStorage.setItem("cartItems", JSON.stringify(state));
        },
        calculatePrice: (state) => {
            const subtotal = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
            localStorage.setItem("cartItems", JSON.stringify(state));
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState,
    }

})

export const { addToCartRequest, removeCartItem, calculatePrice, discountApplied,
    saveShippingInfo, resetCart
} = cartReducer.actions;    