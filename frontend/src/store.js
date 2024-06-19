import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    ...rootReducer,
    notifications: notificationReducer,
  },
});

export default store;
