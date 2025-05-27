import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    isCategoryOpen: false,
    activeCategoryId: null,
    filters: {
        activeCategoryId: null,
        isReductionActivated: false,
        isFreeShippingActivated: false,
        isVidiChoiceActivated: false,
        isBestSellsActivated: false,
        isPriceActivated: false,
        isFavoriteActivated: false,
        priceRange: {
            minimum: 0,
            maximum: 500,
        },
    },
    savedFilters: {
        activeCategoryId: null,
        isReductionActivated: false,
        isFreeShippingActivated: false,
        isVidiChoiceActivated: false,
        isBestSellsActivated: false,
        isPriceActivated: false,
        isFavoriteActivated: false,
        priceRange: {
            minimum: 0,
            maximum: 500,
        },
    },
    sort: {
        type: "down",
        value: "name",
    },
    error: "",
};

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        filterSuccess: (state, action) => {
            state.filters = action.payload;
            state.isModalOpen = false;
            state.error = "";
        },
        filterError: (state, action) => {
            state.error = action.payload;
        },
        setActiveCategoryId: (state, action) => {
            state.activeCategoryId = action.payload;
        },
        toggleIsCategoryOpen: (state) => {
            state.isCategoryOpen = !state.isCategoryOpen;
        },
        toggleCheckbox: (state, action) => {
            const key = action.payload.key;
            const value = action.payload.value;
            if (value === null) {
                state.filters[key] = initialState.filters[key];
                state.savedFilters[key] = initialState.filters[key];
            } else {
                state.filters[key] = value;
            }
        },
        handlePriceChange: (state, action) => {
            const price = action.payload;
            if (price === null) {
                state.filters.isPriceActivated = false;
                state.filters.priceRange["maximum"] =
                    initialState.filters.priceRange["maximum"];
                state.savedFilters.isPriceActivated = false;
                state.savedFilters.priceRange["maximum"] =
                    initialState.filters.priceRange["maximum"];
            } else {
                state.filters.priceRange["maximum"] = price;
                state.filters.isPriceActivated = true;
            }
        },
        saveFilter: (state) => {
            state.isModalOpen = false;
            state.savedFilters = state.filters;
            state.savedFilters.activeCategoryId = state.activeCategoryId;
        },
        removeFilter: (state) => {
            state.isModalOpen = false;
            state.savedFilters = initialState.savedFilters;
            state.filters = initialState.filters;
        },
        handleSortType: (state) => {
            if (state.sort.type === "down") {
                state.sort.type = "up";
            } else {
                state.sort.type = "down";
            }
        },
        handleSortValue: (state, action) => {
            state.sort.value = action.payload;
        },
    },
});

export const {
    toggleModal,
    filterSuccess,
    filterError,
    setActiveCategoryId,
    toggleIsCategoryOpen,
    toggleCheckbox,
    handlePriceChange,
    saveFilter,
    removeFilter,
    handleSortType,
    handleSortValue,
} = filterSlice.actions;

export const selectFilters = (state) => state.filter.filters;
export const selectIsModalOpen = (state) => state.filter.isModalOpen;
export const selectIsCategoryOpen = (state) => state.filter.isCategoryOpen;
export const selectActiveCategory = (state) => state.filter.activeCategory;
export const selectSort = (state) => state.filter.sort;

export default filterSlice.reducer;
