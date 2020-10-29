import maps from '../../data/maps/maps.json';
import { routes } from '../../data/routes/routes';
import { DropdownOption } from './types';

export const options: DropdownOption[] = [
  {
    label: 'Routes',
    name: 'gpxUrl',
    items: routes,
  },
  {
    label: 'Layers',
    name: 'mapUrl',
    items: maps,
  },
  {
    label: 'Options',
    name: 'options',
    type: 'formGroup',
    items: [
      // {
      //   name: 'showElevationProfile',
      //   label: 'Show elevation profile',
      // },
      {
        name: 'showControls',
        label: 'Show controls',
      },
      {
        name: 'showMarkers',
        label: 'Show markers',
      },
      {
        name: 'showRoute',
        label: 'Show route',
      },
    ],
  },
];
