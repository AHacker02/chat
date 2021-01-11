import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import user from "./features/userSlice";
import chat from "./features/chatSlice";
import app from "./features/appSlice";
import { reducer as form } from "redux-form";
const reducer = combineReducers({
  user,
  chat,
  form,
  app,
});
const store = configureStore({
  reducer,
});
export default store;
