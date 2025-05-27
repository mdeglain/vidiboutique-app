import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "@/features/auth/auth.slice";
import userReducer from "@/features/auth/user.slice";
import filterReducer from "@/features/filter/filter.slice";
import categoryReducer from "@/features/category/category.slice";
import searchReducer from "@/features/search/search.slice";
import basketReducer from "@/features/basket/basket.slice";
import addressReducer from "@/features/address/address.slice";
import ordersReducer from "@/features/orders/orders.slice";
import defaultOrderReducer from "@/features/default-order/default-order.slice";

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth", "user"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    filter: filterReducer,
    category: categoryReducer,
    search: searchReducer,
    basket: basketReducer,
    address: addressReducer,
    orders: ordersReducer,
    defaultOrder: defaultOrderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    devTools: process.env.NODE_ENV !== "production",
    reducer: persistedReducer,
});
export const persistor = persistStore(store);
