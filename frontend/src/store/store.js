import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import classReducer from './classSlice'
import pendingReducer from './pendingTasks'
import announcementReducer from "./announcement";
import classUserReducer from './classUser'
import assignmentReducer from './assignments'

const store = configureStore({
  reducer: {
    auth: authReducer,
    class:classReducer,
    announcementSlice: announcementReducer,
    pendingSlice:pendingReducer,
    classUserSlice:classUserReducer,
    assignmentSlice:assignmentReducer,
    
  },
});

export default store;