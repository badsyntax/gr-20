import FullScreen from 'ol/control/FullScreen'
import Attribution from 'ol/control/Attribution'
import Zoom from 'ol/control/Zoom'
import ZoomToExtent from 'ol/control/ZoomToExtent'
import ScaleLine from 'ol/control/ScaleLine'
import RotateNorthControl from './RotateNorthControl'
import PdfExportControl from './PdfExportControl'

export const zoom = new Zoom()

export const zoomToExtentLabel = document.createElement('span')

export const attribution = new Attribution({
  collapsible: true,
})

export const fullScreenLabel = document.createElement('span')

export const fullScreen = new FullScreen({
  label: fullScreenLabel,
})

export const zoomToExtent = new ZoomToExtent({
  label: zoomToExtentLabel,
  extent: [
    978823.488305482,
    5121096.608475749,
    1039463.1111227559,
    5245134.752643153,
  ],
})

export const scaleLine = new ScaleLine({
  units: 'metric',
  minWidth: 100,
})

export const rotateNorthLabel = document.createElement('span')

export const rotateNorth = new RotateNorthControl({
  label: rotateNorthLabel,
})

export const pdfExportLabel = document.createElement('span')

export const pdfExport = new PdfExportControl({
  label: pdfExportLabel,
})
