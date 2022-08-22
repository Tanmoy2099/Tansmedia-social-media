import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text:'',
  data: []
};


const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setText(state, action) { 
      state.text = action.payload;
    },
    resetText(state) { 
      state.text = '';
    },
    setSearch(state, action) {
      state.data = action.payload;
    },
    resetSearch(state) {
      state.data = [];
    }
  }
});

export const searchActions = searchSlice.actions;

export default searchSlice.reducer;