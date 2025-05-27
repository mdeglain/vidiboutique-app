import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

const initialState = {
    defaultOrders: [],
    loading: false,
    error: null,
};

export const defaultOrderSlice = createSlice({
    name: "defaultOrder",
    initialState,
    reducers: {
        setDefaultOrders: (state, action) => {
            state.defaultOrders = action.payload;
            state.loading = false;
            state.error = null;
        },
        addDefaultOrder: (state, action) => {
            state.defaultOrders = [...state.defaultOrders, action.payload];
            state.loading = false;
            state.error = null;
        },
        removeDefaultOrder: (state, action) => {
            state.defaultOrders = state.defaultOrders.filter(
                (order) => order.public_id !== action.payload
            );
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addItemToDefaultOrder: (state, action) => {
            state.defaultOrders = state.defaultOrders.map((order) =>
                order.public_id === action.payload.orderId
                    ? {
                          ...order,
                          items: [...order.items, action.payload.item],
                      }
                    : order
            );
        },
        updateItemQuantity: (state, action) => {
            const { defaultOrderPublicId, itemPublicId, value } =
                action.payload;

            const defaultOrderIndex = state.defaultOrders.findIndex(
                (order) => order.public_id === defaultOrderPublicId
            );

            const savedDefaultOrders = cloneDeep(state.defaultOrders);

            if (defaultOrderIndex !== -1) {
                const itemIndex = savedDefaultOrders[
                    defaultOrderIndex
                ].items.findIndex((item) => item.public_id === itemPublicId);

                if (itemIndex !== -1) {
                    savedDefaultOrders[defaultOrderIndex].items[
                        itemIndex
                    ].quantity = value;
                    state.defaultOrders = savedDefaultOrders;
                }
            }
        },
        deleteItemFromDefaultOrder: (state, action) => {
            state.defaultOrders = state.defaultOrders.map((order) =>
                order.public_id === action.payload.orderId
                    ? {
                          ...order,
                          items: order.items.filter(
                              (item) =>
                                  item.public_id !== action.payload.itemPublicId
                          ),
                      }
                    : order
            );
        },
        clearDefaultOrder: (state, action) => {
            state.defaultOrders = state.defaultOrders.filter(
                (order) => order.public_id !== action.payload
            );
        },
    },
});

export const {
    setDefaultOrders,
    addDefaultOrder,
    removeDefaultOrder,
    setLoading,
    setError,
    addItemToDefaultOrder,
    updateItemQuantity,
    deleteItemFromDefaultOrder,
    clearDefaultOrder,
} = defaultOrderSlice.actions;

export default defaultOrderSlice.reducer;
