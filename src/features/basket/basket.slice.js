import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';

const initialState = {
    products: [],
};

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.products = initialState.products
        },
        initCart: (state, action) => {
            state.products = action.payload
        },
        addProduct: (state, action) => {
            const cartItem = action.payload
            const savedProducts = cloneDeep(state.products)
            const savedProductIndex = savedProducts.findIndex(elem => elem.public_id === cartItem.public_id)

            if (savedProductIndex === -1) {
                savedProducts.push(cartItem)
                state.products = savedProducts
            } else {
                savedProducts[savedProductIndex].quantity += cartItem.quantity
                state.products = savedProducts
            }
        },
        deleteProduct: (state, action) => {
            const cartItemPublicId = action.payload
            const productIndex = state.products.findIndex(elem => elem.public_id === cartItemPublicId)

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
            const { publicId, value } = action.payload
            const productIndex = state.products.findIndex(elem => elem.public_id === publicId)

            const savedProducts = cloneDeep(state.products)

            if (productIndex !== -1) {
                savedProducts[productIndex] = value
                state.products = savedProducts
            }
        }
    }
});

export const { resetCart, initCart, addProduct, deleteProduct, deleteAllProducts, updateQuantity } = basketSlice.actions;

export default basketSlice.reducer;
