import Attribution from 'ol/control/Attribution';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';

export const zoomControl = new Zoom();

export const attributionControl = new Attribution({
  collapsible: true,
});

export const scaleLineControl = new ScaleLine({
  units: 'metric',
  minWidth: 100,
});

const controls = [zoomControl, attributionControl, scaleLineControl];

export default controls;
