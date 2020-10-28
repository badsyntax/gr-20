export interface DropdownOptionItem {
  name: string;
  label?: string;
  url?: string;
  samplingDistance?: number;
}

export interface DropdownOption {
  name: string;
  label: string;
  type?: string;
  items: DropdownOptionItem[];
}

export interface SelectedOptions {
  gpxUrl: string;
  mapUrl: string;
  showElevationProfile: boolean;
  showControls: boolean;
  showMarkers: boolean;
  showRoute: boolean;
}
