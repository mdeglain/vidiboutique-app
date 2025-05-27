import { createSlice } from '@reduxjs/toolkit';

// import { categories } from '../../mocks/categories';

const initialState = {
    addresses: [],
    error: ""
};

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        addressesSuccess: (state, action) => {
            state.addresses = action.payload
            state.error = ""
        },
        addressesError: (state, action) => {
            state.error = action.payload
        },
        createAddress: (state, action) => {
            state.addresses.push(action.payload)
        },
        updateAddress: (state, action) => {
            state.addresses = state.addresses.map(address => address.public_id === action.payload.public_id ? action.payload : address)
        },
        removeAddress: (state, action) => {
            state.addresses = state.addresses.filter(address => address.public_id !== action.payload)
        }
    }
});

export const { addressesSuccess, addressesError, createAddress, updateAddress, removeAddress } = addressSlice.actions;

export const selectAddresses = (state) => state.address.addresses

export default addressSlice.reducer;
