import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search: "",
    savedSearch: "",
    isSearchActivated: false,
    submitSearch: 0,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        resetSearch: (state, action) => {
            state.search = initialState.search
            state.savedSearch = initialState.savedSearch
            state.isSearchActivated = initialState.isSearchActivated
        },
        setSearch: (state, action) => {
            state.search = action.payload
        },
        setIsSearchActivated: (state, action) => {
            state.isSearchActivated = action.payload
            state.savedSearch = state.search
            state.submitSearch += 1
        },
    }
});

export const { setSearch, setIsSearchActivated, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
