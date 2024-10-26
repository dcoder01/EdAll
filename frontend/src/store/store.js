import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import classReducer from './classSlice'
import pendingReducer from './pendingTasks'
import announcementReducer from "./announcement";
const store = configureStore({
  reducer: {
    auth: authReducer,
    class:classReducer,
    announcementSlice: announcementReducer,
    pendingSlice:pendingReducer
    
  },
});

export default store;