import { configureStore } from '@reduxjs/toolkit';
// import { authApi } from './features/authApi';
import { authApi } from './api/registerApi';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
