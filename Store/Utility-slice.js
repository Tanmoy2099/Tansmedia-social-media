import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: [],
  darkMode: true
};

const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  
  reducers: {
    setNotification(state, action) {
      state.notification = action.payload;
    },

    resetNotification(state) {
      state.notification = [];
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    }
  }
});

export const utilityActions = utilitySlice.actions;

export default utilitySlice.reducer;