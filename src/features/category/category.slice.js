import { createSlice } from '@reduxjs/toolkit';

// import { categories } from '../../mocks/categories';

const initialState = {
    categories: [],
    error: ""
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        categoriesSuccess: (state, action) => {
            state.categories = action.payload
            state.error = ""
        },
        categoriesError: (state, action) => {
            state.error = action.payload
        }
    }
});

export const { categoriesSuccess, categoriesError } = categorySlice.actions;

export const selectCategories = (state) => state.category.categories

export default categorySlice.reducer;
