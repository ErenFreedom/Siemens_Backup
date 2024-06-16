import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Existing fetchData action
export const fetchData = createAsyncThunk(
  'data/fetchData',
  async ({ url, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(url, {
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

// New fetchTempData action
export const fetchTempData = createAsyncThunk(
  'data/fetchTempData',
  async ({ filter, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/graph/temp/${filter}`, {
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
