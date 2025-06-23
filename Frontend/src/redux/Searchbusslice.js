// src/redux/busSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [], // array of found buses
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload; // payload should be an array of bus objects
    },
    clearSearchResults: (state) => {
      state.results = [];
    }
  },
});

export const { setSearchResults, clearSearchResults } = busSlice.actions;
export default busSlice.reducer;
