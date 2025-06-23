// src/redux/busSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [], // array of found buses
};

const mybookingbusSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setmybookingResults: (state, action) => {
      state.results = action.payload; // payload should be an array of bus objects
    },
  },
});

export const { setmybookingResults } = mybookingbusSlice.actions;
export default mybookingbusSlice.reducer;
