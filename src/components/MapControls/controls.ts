import Attribution from 'ol/control/Attribution';
import Control from 'ol/control/Control';
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

const controls: Control[] = [
  /*zoomControl, attributionControl, scaleLineControl*/
];

export default controls;
