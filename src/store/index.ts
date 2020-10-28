import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import { rootReducer, RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware(),
});

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export type { RootState };

export type AppDispatch = typeof store.dispatch;
