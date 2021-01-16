import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    form: {},
    loading: { group: false },
  },
  reducers: {
    setFormError: (state, action) => {
      state.form[action.payload.name] = action.payload.error;
    },
    setLoading: (state, action) => {
      state.loading[action.payload.name] = action.payload.loading;
    },
  },
});
export const { setFormError, setLoading } = appSlice.actions;
export const selectFormError = (state, formName) => state.app.form[formName];
export const selectLoading = (state, loader) => state.app.loading[loader];
export default appSlice.reducer;
