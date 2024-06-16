import { createSlice } from '@reduxjs/toolkit';
import { fetchData, fetchTempData } from '../actions/dataActions';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: null,
    tempData: null, // New state for temperature data
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.data = null;
        state.error = action.error.message;
      })
      .addCase(fetchTempData.fulfilled, (state, action) => {
        state.tempData = action.payload;
        state.error = null;
      })
      .addCase(fetchTempData.rejected, (state, action) => {
        state.tempData = null;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
