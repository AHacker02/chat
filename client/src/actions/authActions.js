import {
  AUTH_ERROR,
  HIDE_LOADER,
  SHOW_LOADER,
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
} from "./types";
import history from "../history";
import api from "../utils/api";
import { LOGIN, SIGNUP } from "../utils/endpoints";

export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch({ type: SHOW_LOADER });
  try {
    const response = await api.get(LOGIN, {
      params: {
        email,
        password,
      },
    });

    dispatch({
      type: SIGN_IN,
      payload: response.data.data,
    });
    history.push("/");
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
      payload: error.message,
    });
  }
  dispatch({ type: HIDE_LOADER });
};

export const signUp = (userDetails) => async (dispatch) => {
  dispatch({ type: SHOW_LOADER });
  try {
    const response = await api.post(SIGNUP, JSON.stringify(userDetails));

    dispatch({
      type: SIGN_UP,
      payload: response,
    });
    history.push("/authorize/login");
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
      payload: error.message,
    });
  }
  dispatch({ type: HIDE_LOADER });
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};
