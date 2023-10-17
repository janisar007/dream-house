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

    //3.Reducers for deleting the user account ->
    deleteUserStart: (state) => {
      state.loading = true;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    //3.Reducers for sign out ->
    signOutUserStart: (state) => {
      state.loading = true;
    },

    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions; //donot know why action here.

export default userSlice.reducer; //now import and cofig this reducer in the store.
