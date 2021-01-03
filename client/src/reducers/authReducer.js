import { SIGN_IN, AUTH_ERROR, SIGN_OUT, SIGN_UP } from "../actions/types";
import { saveState } from "../utils/localStorage";

const INITIAL_AUTH = {
  isSignedIn: null,
  currentUser: null,
  token: null,
  errorMessage: null,
};

export const authReducer = (state = INITIAL_AUTH, { type, payload }) => {
  switch (type) {
    case SIGN_IN:
      let newState = {
        ...state,
        isSignedIn: true,
        currentUser: payload.user,
        token: payload.token,
        errorMessage: null,
      };

      saveState(newState);
      return newState;
    case SIGN_OUT:
    case SIGN_UP:
      return {
        ...state,
        isSignedIn: false,
        currentUser: null,
        token: null,
        errorMessage: null,
      };
    case AUTH_ERROR: {
      return { ...state, errorMessage: payload };
    }
    default:
      return state;
  }
};
