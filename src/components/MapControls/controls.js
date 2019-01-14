import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import ScaleLine from 'ol/control/ScaleLine';
import RotateNorthControl from './RotateNorthControl';
import PdfExportControl from './PdfExportControl';
import DownloadControl from './DownloadControl';
import MyLocationControl from './MyLocationControl';

const button = title => {
  const newButton = document.createElement('button');
  newButton.setAttribute('title', title);
  return newButton;
};

export const zoom = new Zoom();

export const attribution = new Attribution({
  collapsible: true,
});

export const fullScreen = new FullScreen({});

export const zoomToExtent = new ZoomToExtent({
  label: document.createElement('span'),
  extent: [
    978823.488305482,
    5121096.608475749,
    1039463.1111227559,
    5245134.752643153,
  ],
});

export const scaleLine = new ScaleLine({
  units: 'metric',
  minWidth: 100,
});

export const rotateNorth = new RotateNorthControl({
  label: button('Rotate North'),
});

export const pdfExport = new PdfExportControl({
  label: button('Export to PDF'),
});

export const download = new DownloadControl({
  label: button('Download Route and Maps'),
});

export const myLocation = new MyLocationControl({
  label: button('Show My Location'),
});
