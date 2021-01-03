import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./authReducer";
import { loaderReducer } from "./loaderReducer";
import { chatReducer } from "./chatReducer";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  application: loaderReducer,
  chat: chatReducer,
});
