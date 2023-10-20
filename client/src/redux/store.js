import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

//Problem: since every time we reload the browser we lost the information stored in store from browser. to solve this problem we are going to use a package named 'redux-persist'.
const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persisitedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
//   reducer: {user: userReducer},
  reducer: persisitedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);