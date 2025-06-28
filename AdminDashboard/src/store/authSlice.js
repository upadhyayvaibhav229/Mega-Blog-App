import { createSlice } from "@reduxjs/toolkit";

const tokenFromLocalStorage = localStorage.getItem("token");
const backendUrl = import.meta.env.VITE_BACKEND_URL

const initialState = {
  status: !!tokenFromLocalStorage,
  userData: null,
  token: tokenFromLocalStorage || null,
  backendUrl
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem("token", action.payload.accessToken);
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.userData = action.payload;
    }
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
