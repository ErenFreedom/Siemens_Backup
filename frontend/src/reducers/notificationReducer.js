import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications, addNotification } from '../actions/notificationActions';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notifications = [];
        state.error = action.error.message;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.error = null;
      });
  },
});

export default notificationSlice.reducer;
