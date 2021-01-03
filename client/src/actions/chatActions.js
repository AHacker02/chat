import {
  HIDE_LOADER,
  MESSAGE,
  SELECTED_CHAT,
  SHOW_LOADER,
  SEARCH_USER,
} from "./types";
import api from "../utils/api";
import { MESSAGES, SEARCH } from "../utils/endpoints";

let cancelToken;

export const newMessage = (message) => {
  return {
    type: MESSAGE,
    payload: message,
  };
};

export const searchUser = (searchTerm) => async (dispatch) => {
  dispatch({ type: SHOW_LOADER });
  try {
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = api.CancelToken.source();
    const response = await api.get(SEARCH, {
      params: { userSearch: searchTerm },
      cancelToken: cancelToken.token,
    });
    dispatch({ type: SEARCH_USER, payload: response.data.data });
    dispatch({ type: HIDE_LOADER });
  } catch (error) {
    console.log(error.message);
  }
};

export const selectChat = (chat) => {
  return {
    type: SELECTED_CHAT,
    payload: chat,
  };
};

export const openChat = (id) => async (dispatch) => {
  try {
    const response = await api.get(MESSAGES, {
      params: {
        userId: id,
      },
    });
    dispatch(newMessage(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const sendMessage = (message) => (dispatch, getState, invoke) => {
  let userId = getState().chat.selectedChat.id;
  let clientId = getState().chat.selectedChat.clientId;
  console.log(invoke);
  //invoke("SendMessage", userId, clientId, message);
  dispatch({
    type: MESSAGE,
    payload: [
      {
        fromUserId: getState().auth.currentUser.id,
        toUserId: userId,
        messageText: message,
        sentAt: new Date().getDate(),
        isRead: false,
      },
    ],
  });
};
