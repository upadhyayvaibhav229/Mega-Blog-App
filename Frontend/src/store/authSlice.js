import { createSlice } from "@reduxjs/toolkit";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const initialState = {
    status : false,
    userData: null,
    backendUrl
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.user;
            console.log("action.payload.userData", action.payload.user);
            
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;