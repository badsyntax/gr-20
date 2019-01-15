import maps from '../../data/maps/maps';
import routes from '../../data/routes/routes';

export default [
  {
    label: 'Routes',
    name: 'route',
    items: routes,
  },
  {
    label: 'Layers',
    name: 'map',
    items: maps,
  },
  {
    label: 'Options',
    name: 'options',
    type: 'formGroup',
    items: [
      {
        name: 'showElevationProfile',
        label: 'Show elevation profile',
      },
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
