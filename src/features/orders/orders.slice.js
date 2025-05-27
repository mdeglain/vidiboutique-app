import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    adminOrders: [],
    error: "",
};

export const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
            state.error = "";
        },
        setAdminOrders: (state, action) => {
            state.adminOrders = action.payload;
            state.error = "";
        },
    },
});

export const { setOrders, setAdminOrders } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectAdminOrders = (state) => state.orders.adminOrders;

export default ordersSlice.reducer;
