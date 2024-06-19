import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification, { getState }) => {
    const state = getState();
    const notifications = state.notifications.notifications;
    return [...notifications, notification];
  }
);
