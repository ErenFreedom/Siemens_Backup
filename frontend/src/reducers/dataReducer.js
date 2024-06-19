const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {
      temp: null,
      pressure: null,
      rh: null,
      humidity: null,
    },
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
      })
      .addCase(fetchRhData.fulfilled, (state, action) => {
        state.rhData = action.payload;
        state.error = null;
      })
      .addCase(fetchRhData.rejected, (state, action) => {
        state.rhData = null;
        state.error = action.error.message;
      })
      .addCase(fetchPressureData.fulfilled, (state, action) => {
        state.pressureData = action.payload;
        state.error = null;
      })
      .addCase(fetchPressureData.rejected, (state, action) => {
        state.pressureData = null;
        state.error = action.error.message;
      })
      .addCase(fetchHumidityData.fulfilled, (state, action) => {
        state.humidityData = action.payload;
        state.error = null;
      })
      .addCase(fetchHumidityData.rejected, (state, action) => {
        state.humidityData = null;
        state.error = action.error.message;
      });
  },
});
