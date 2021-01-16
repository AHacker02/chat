import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import user from "./features/userSlice";
import chat from "./features/chatSlice";
import app from "./features/appSlice";
import { reducer as form } from "redux-form";
import { saveAuthToken } from "./utils/api";
const reducer = combineReducers({
  user,
  chat,
  form,
  app,
});
const store = configureStore({
  reducer,
  middleware: [saveAuthToken, ...getDefaultMiddleware()],
});
export default store;
