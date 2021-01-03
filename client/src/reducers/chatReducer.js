import {
  UPDATE_CHAT_LIST,
  MESSAGE,
  SELECTED_CHAT,
  SEARCH_USER,
} from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
  search: [],
  chatList: {},
  messages: [],
  selectedChat: null,
};
export const chatReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SEARCH_USER:
      return { ...state, search: payload };
    case UPDATE_CHAT_LIST:
      return {
        ...state,
        chatList: { ...state.chatList, ..._.mapKeys(payload, "id") },
      };
    case SELECTED_CHAT: {
      let newState = { ...state, selectedChat: payload };
      if (!state.chatList[payload.id]) {
        newState = {
          ...newState,
          chatList: { ...newState.chatList, [payload.id]: payload },
        };
      }
      return newState;
    }
    case MESSAGE:
      if (Array.isArray(payload)) {
        return { ...state, messages: payload };
      }
      return { ...state, messages: [...state.messages, ...[payload]] };
    default:
      return state;
  }
};
