import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api';

import authReducer from "@/features/auth/auth.slice";
import userReducer from "@/features/auth/user.slice";
import filterReducer from "@/features/filter/filter.slice";
// import categoryReducer from "@/features/category/category.slice"; // Removed
import searchReducer from "@/features/search/search.slice";
// import basketReducer from "@/features/basket/basket.slice"; // Removed
// import addressReducer from "@/features/address/address.slice"; // Removed
// import ordersReducer from "@/features/orders/orders.slice"; // Removed
// import defaultOrderReducer from "@/features/default-order/default-order.slice"; // Removed

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth", "user"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    filter: filterReducer,
    // category: categoryReducer, // Removed
    search: searchReducer,
    // basket: basketReducer, // Removed
    // address: addressReducer, // Removed
    // orders: ordersReducer, // Removed
    // defaultOrder: defaultOrderReducer, // Removed
    [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    devTools: process.env.NODE_ENV !== "production",
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
export const persistor = persistStore(store);

setupListeners(store.dispatch);
