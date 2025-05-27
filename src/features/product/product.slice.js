import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';

const initialState = {
    products: [],
};

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            const product = action.payload

            const savedProducts = cloneDeep(state.products)
            const savedProductIndex = savedProducts.findIndex(elem => elem.id === product.id)

            if (savedProductIndex === -1) {
                savedProducts.push(product)
                state.products = savedProducts
            } else {
                savedProducts[savedProductIndex].quantity += product.quantity
                state.products = savedProducts
            }
        },
        deleteProduct: (state, action) => {
            const productId = action.payload
            const productIndex = state.products.findIndex(elem => elem.id === productId)

            const savedProducts = cloneDeep(state.products)

            if (productIndex !== -1) {
                savedProducts.splice(productIndex, 1)
                state.products = savedProducts
            }
        },
        deleteAllProducts: (state) => {
            state.products = []
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload
            const productIndex = state.products.findIndex(elem => elem.id === productId)

            const savedProducts = cloneDeep(state.products)

            if (productIndex !== -1) {
                savedProducts[productIndex].quantity = quantity
                state.products = savedProducts
            }
        }
    }
});

export const { addProduct, deleteProduct, deleteAllProducts, updateQuantity } = basketSlice.actions;

export default basketSlice.reducer;
