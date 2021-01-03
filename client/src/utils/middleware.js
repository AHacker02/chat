import { SIGN_IN } from "../actions/types";
import { setToken } from "./api";

export const saveAuthToken = (store) => (next) => (action) => {
  if (action.type === SIGN_IN) {
    // after a successful login, update the token in the API
    setToken(action.payload.token);
  }

  // continue processing this action
  return next(action);
};
