import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import api from "../utils/api";
import { MESSAGES, SEARCH } from "../utils/endpoints";

let cancelToken;

export const searchContact = createAsyncThunk(
  "chat/search",
  async (searchTerm, thunkAPI) => {
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = api.CancelToken.source();
    const response = await api.get(SEARCH, {
      params: { userSearch: searchTerm },
      cancelToken: cancelToken.token,
    });

    return response.data.data;
  }
);

export const selectChat = createAsyncThunk(
  "chat/selectChat",
  async (user, thunkAPI) => {
    const response = await api.get(MESSAGES, {
      params: {
        userId: user.id,
      },
    });
    return { ...user, messages: response.data.data };
  }
);

const INITIAL_STATE = {
  chats: {},
  selectedChat: null,
  searchResult: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: INITIAL_STATE,
  reducers: {
    setChatList: (state, action) => {
      _.forIn(_.mapKeys(action.payload, "id"), (value, key) => {
        state.chats[key] = value;
      });
    },
    setStatus: (state, action) => {
      state.chats[action.payload.id].status = action.payload.status;
    },
    addMessage: (state, action) => {
      let userId;
      if (state.chats[action.payload.fromUserId]) {
        userId = action.payload.fromUserId;
      } else if (state.chats[action.payload.toUserId]) {
        userId = action.payload.toUserId;
      }
      //state.chats[userId].messages.push(action.payload);
      state.chats[userId].lastMessage = action.payload.messageText;
      state.chats[userId].lastMessageTime = action.payload.sentAt;
      if (state.selectedChat.id === userId) {
        state.selectedChat.messages.push(action.payload);
      }
    },
    resetChat: (state, action) => {
      return INITIAL_STATE;
    },
  },
  extraReducers: {
    [searchContact.fulfilled]: (state, action) => {
      state.searchResult = action.payload;
    },
    [selectChat.fulfilled]: (state, action) => {
      state.selectedChat = action.payload;
      state.chats[action.payload.id] = action.payload;
      state.searchResult = null;
    },
  },
});
export const {
  setChatList,
  addMessage,
  setStatus,
  resetChat,
} = chatSlice.actions;
export const selectedChat = (state) => state.chat.selectedChat;
export const selectChatList = (state) => state.chat.chats;
export const selectSearchResult = (state) => state.chat.searchResult;
export default chatSlice.reducer;
