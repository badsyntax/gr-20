import { createSlice } from '@reduxjs/toolkit';
import maps from '../data/maps/maps.json';
import { routes } from '../data/routes/routes';

export interface SettingsState {
  mapUrl: string;
  gpxUrl: string;
  showElevationProfile: boolean;
  showControls: boolean;
  showMarkers: boolean;
  showRoute: boolean;
}

const initialState: SettingsState = {
  mapUrl: maps[0].url,
  gpxUrl: routes[0].url,
  showElevationProfile: false,
  showControls: true,
  showMarkers: true,
  showRoute: true,
};

const SettingsSlice = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    updateSettings: (state, action): void => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateSettings } = SettingsSlice.actions;

export const { reducer: settingsReducer } = SettingsSlice;
