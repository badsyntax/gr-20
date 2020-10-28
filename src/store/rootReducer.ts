import { combineReducers } from '@reduxjs/toolkit';
import { settingsReducer } from '../features/settings';
import { spinnerReducer } from '../features/spinner';

export const rootReducer = combineReducers({
  settings: settingsReducer,
  spinner: spinnerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
