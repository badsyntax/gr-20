import { createSlice } from '@reduxjs/toolkit';

export interface SpinnerState {
  isVisible: boolean;
}

const initialState: SpinnerState = {
  isVisible: false,
};

const SpinnerSlice = createSlice({
  name: 'Spinner',
  initialState,
  reducers: {
    showSpinner: (state): void => {
      state.isVisible = true;
    },
    hideSpinner: (state): void => {
      state.isVisible = false;
    },
  },
});

export const { showSpinner, hideSpinner } = SpinnerSlice.actions;

export const { reducer: spinnerReducer } = SpinnerSlice;
