import { HIDE_LOADER, SHOW_LOADER } from "../actions/types";

const INITIAL_STATE = {
  isLoading: false,
};

export const loaderReducer = (state = INITIAL_STATE, { type }) => {
  switch (type) {
    case SHOW_LOADER:
      return { ...state, isLoading: true };
    case HIDE_LOADER:
      return { ...state, isLoading: false };
    default:
      return state;
  }
};
