import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    //1.Reducers for sign in ->
    signInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },

    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    //2.Reducers for updating user info ->
    updateUserStart: (state) => {
      state.loading = true;
    },

    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure} = userSlice.actions; //donot know why action here.

export default userSlice.reducer; //now import and cofig this reducer in the sttore.
