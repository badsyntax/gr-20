import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import ScaleLine from 'ol/control/ScaleLine';
import RotateNorthControl from './RotateNorthControl';
import PdfExportControl from './PdfExportControl';
import DownloadControl from './DownloadControl';
import MyLocationControl from './MyLocationControl';
import GetLinkControl from './GetLinkControl';

const button = title => {
  const newButton = document.createElement('button');
  newButton.setAttribute('title', title);
  return newButton;
};

export const zoomControl = new Zoom();

export const zoomToExtentControl = new ZoomToExtent({
  label: document.createElement('span'),
  extent: [
    978823.488305482,
    5121096.608475749,
    1039463.1111227559,
    5245134.752643153,
  ],
});

export const attributionControl = new Attribution({
  collapsible: true,
});

export const fullScreenControl = new FullScreen({});

export const scaleLineControl = new ScaleLine({
  units: 'metric',
  minWidth: 100,
});

export const rotateNorthControl = new RotateNorthControl({
  label: button('Rotate North'),
});

export const pdfExportControl = new PdfExportControl({
  label: button('Export to PDF'),
});

export const downloadControl = new DownloadControl({
  label: button('Download Route and Maps'),
});

export const myLocationControl = new MyLocationControl({
  label: button('Show My Location'),
});

export const linkControl = new GetLinkControl({
  label: button('Get Shareable Link'),
});

export const allControls = [
  zoomControl,
  zoomToExtentControl,
  attributionControl,
  fullScreenControl,
  scaleLineControl,
  rotateNorthControl,
  pdfExportControl,
  downloadControl,
  myLocationControl,
  linkControl,
];
