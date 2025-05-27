import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalOpen: false,
    auth: {},
    error: "",
    accessToken: "",
    refreshToken: ""
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        authSuccess: (state, action) => {
            state.accessToken = action.payload.access_token
            state.refreshToken = action.payload.refresh_token
            state.isModalOpen = false
            state.error = ""
            // localStorage.setItem("refreshToken", action.payload.refresh_token)
        },
        authRefresh: (state, action) => {
            state.accessToken = action.payload.access_token
            state.refreshToken = action.payload.refresh_token

            const auth = localStorage.getItem("persist:root");
            const authData = JSON.parse(JSON.parse(auth).auth);
            authData.accessToken = action.payload.access_token;
            authData.refreshToken = action.payload.refresh_token;
            localStorage.setItem("persist:root", JSON.stringify({ ...JSON.parse(auth), auth: authData }));
        },
        authError: (state, action) => {
            state.error = action.payload
        },
        disconnect: (state) => {
            state.accessToken = ""
            state.refreshToken = ""
            localStorage.removeItem("refreshToken")
        }
    }
});

export const { toggleModal, authSuccess, authError, disconnect, authRefresh } = authSlice.actions;

export default authSlice.reducer;