// import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine';

export const zoomControl = new Zoom();

export const attributionControl = new Attribution({
  collapsible: true,
});

// export const fullScreenControl = new FullScreen({});

export const scaleLineControl = new ScaleLine({
  units: 'metric',
  minWidth: 100,
});

export const allControls = [
  zoomControl,
  attributionControl,
  // fullScreenControl,
  scaleLineControl,
];
