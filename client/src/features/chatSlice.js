import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import api from "../utils/api";
import { CREATE_GROUP, MESSAGES, SEARCH } from "../utils/endpoints";

let cancelToken;
const INITIAL_STATE = {
  chats: {},
  selectedChat: null,
  searchResult: [],
};

const shortenMessage = (message) => {
  if (message.length > 30) {
    return message.substr(0, 30) + "...";
  }
  return message;
};

// Search users bu Name or email
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

// Get last 20 messages for selected chat
export const selectChat = createAsyncThunk(
  "chat/selectChat",
  async (user, thunkAPI) => {
    if (thunkAPI.getState().chat.chats[user.id]) {
      const response = await api.get(MESSAGES, {
        params: {
          threadId: user.id,
        },
      });
      return { ...user, messages: response.data.data };
    } else {
      const loggedUser = JSON.parse(sessionStorage.getItem("user"));
      const response = await api.post(
        CREATE_GROUP,
        JSON.stringify({ Users: [user.id, loggedUser.user.id] })
      );
      return { ...user, id: response.data.data.id, messages: [] };
    }
  }
);

export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (group, thunkAPI) => {
    const response = await api.post(CREATE_GROUP, JSON.stringify(group));
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: INITIAL_STATE,
  reducers: {
    setChatList: (state, action) => {
      _.forIn(_.mapKeys(action.payload, "id"), (value, key) => {
        value.lastMessage = shortenMessage(value.lastMessage);
        state.chats[key] = value;
      });
    },
    setStatus: (state, action) => {
      let chat = _.values(state.chats).filter(
        (x) => x.email === action.payload.email
      )[0];
      chat.status = action.payload.status;
      chat.clientId = action.payload.clientId;
      state.chats[chat.id] = chat;
    },
    addMessage: (state, action) => {
      if (!state.chats[action.payload.threadId].messages) {
        state.chats[action.payload.threadId].messages = [];
      }
      state.chats[action.payload.threadId].messages.push(action.payload);
      state.chats[action.payload.threadId].lastMessage = shortenMessage(
        action.payload.messageText
      );
      state.chats[action.payload.threadId].lastMessageTime =
        action.payload.sentAt;
      if (state.selectedChat?.id === action.payload.threadId) {
        state.selectedChat.messages.push(action.payload);
      }
    },
    clearChatSelection: (state) => {
      state.selectedChat = INITIAL_STATE.selectedChat;
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
      state.searchResult = INITIAL_STATE.searchResult;
    },
  },
});
export const {
  setChatList,
  addMessage,
  setStatus,
  resetChat,
  clearChatSelection,
} = chatSlice.actions;
export const selectedChat = (state) => state.chat.selectedChat;
export const selectChatList = (state) => state.chat.chats;
export const selectSearchResult = (state) => state.chat.searchResult;
export default chatSlice.reducer;
