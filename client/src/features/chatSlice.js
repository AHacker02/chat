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
    try {
      const response = await api.get(MESSAGES, {
        params: {
          userId: user.id,
        },
      });
      return { ...user, messages: response.data.data };
    } catch (e) {
      console.log(e);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    selectedChat: null,
    searchResult: [],
  },
  reducers: {
    setChatList: (state, action) => {
      _.forIn(_.mapKeys(action.payload, "id"), (value, key) => {
        state.chats[key] = value;
      });
    },
    setStatus: (state, action) => {
      state.chats[action.payload.id] = action.payload;
    },
    addMessage: (state, action) => {
      if (state.chats[action.payload.fromUserId]) {
        state.chats[action.payload.fromUserId].messages.push(action.payload);
      } else if (state.chats[action.payload.toUserId]) {
        state.chats[action.payload.toUserId].messages.push(action.payload);
      }
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
export const { setChatList, addMessage, setStatus } = chatSlice.actions;
export const selectedChat = (state) => state.chat.selectedChat;
export const selectChatList = (state) => state.chat.chats;
export const selectSearchResult = (state) => state.chat.searchResult;
export default chatSlice.reducer;
