import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    client_id: null,
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    organization_id: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.public_id;
            state.client_id = action.payload.client_id;
            state.email = action.payload.email;
            state.firstName = action.payload.first_name;
            state.lastName = action.payload.last_name;
            state.role = action.payload.role;
            state.organization_id = action.payload.organization_id;
        },
        resetUser: (state) => {
            state.id = initialState.id;
            state.client_id = initialState.client_id;
            state.email = initialState.email;
            state.firstName = initialState.firstName;
            state.lastName = initialState.lastName;
            state.role = initialState.role;
            state.organization_id = initialState.organization_id;
        },
        updateUser: (state, action) => {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
        },
    },
});

export const { setUser, resetUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
