import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import { LOGIN, SIGNUP } from "../utils/endpoints";
import { setFormError, setLoading } from "./appSlice";
import { resetChat } from "./chatSlice";

const initialUser = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

export const login = createAsyncThunk(
  "user/login",
  async (userCreds, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading({ name: "login", loading: true }));
      const response = await api.get(LOGIN, {
        params: userCreds,
      });
      thunkAPI.dispatch(setLoading({ name: "login", loading: false }));

      return response.data.data;
    } catch (err) {
      thunkAPI.dispatch(setFormError({ name: "login", error: err.message }));
      thunkAPI.dispatch(setLoading({ name: "login", loading: false }));
      throw new Error(err);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userDetails, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading({ name: "register", loading: true }));
      const response = await api.post(SIGNUP, JSON.stringify(userDetails));
      thunkAPI.dispatch(
        login({ email: userDetails.email, password: userDetails.password })
      );
      thunkAPI.dispatch(setLoading({ name: "register", loading: false }));
      return response.data.data;
    } catch (e) {
      thunkAPI.dispatch(setFormError({ name: "register", error: e.message }));
      thunkAPI.dispatch(setLoading({ name: "register", loading: false }));
      throw new Error(e);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkApi) => {
  thunkApi.dispatch(resetChat());
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser,
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    [logout.fulfilled]: (state) => {
      state.user = null;
      sessionStorage.removeItem("user");
    },
  },
});

export const selectUser = (state) => state.user.user?.user;
export const selectToken = (state) => state.user.user?.token;
export default userSlice.reducer;
