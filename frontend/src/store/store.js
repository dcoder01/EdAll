import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import classReducer from './classSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    class:classReducer,
    
  },
});

export default store;