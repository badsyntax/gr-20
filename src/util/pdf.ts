import jsPDF from 'jspdf';
import { boundingExtent, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import SimpleGeometry from 'ol/geom/SimpleGeometry';
import { default as OLMap } from 'ol/Map';
import { Size } from 'ol/size';
import { PDFDims } from './constants';
import { PDFFormat } from './types';

export const exportMapToPDF = async (
  map: OLMap,
  pdf?: jsPDF,
  format: PDFFormat = 'a4',
  resolution = 150,
  reset = true,
  extent: SimpleGeometry | Extent | null = null,
  onBeforeRender = (context: HTMLCanvasElement) => undefined
): Promise<jsPDF> =>
  new Promise(async (resolve) => {
    if (!pdf) {
      pdf = new jsPDF('landscape', undefined, format);
    }
    const dim = PDFDims[format];
    const size = map.getSize();
    const defaultExtent = map.getView().calculateExtent(size);
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const printSize: Size = [width, height];
    const viewResolution = map.getView().getResolution();

    map.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      if (mapContext) {
        Array.prototype.forEach.call(
          document.querySelectorAll('.ol-layer canvas'),
          function (canvas) {
            if (canvas.width > 0) {
              const opacity = canvas.parentNode.style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              const transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              const matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );
              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );
        onBeforeRender(mapCanvas);
        const data = mapCanvas.toDataURL('image/jpeg');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pdf as jsPDF)?.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
      }
      if (reset) {
        map.setSize(size);
        map.getView().fit(extent || defaultExtent, { size });
        map.getView().setResolution(viewResolution);
      }
      resolve(pdf);
    });

    map.setSize(printSize);
    map.getView().fit(extent || defaultExtent, { size: printSize });
  });

export const addPDFTextToCanvas = (
  canvas: HTMLCanvasElement,
  feature: Feature<Point>,
  nextFeature: Feature<Point>
): void => {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  context.font = '16px Arial';

  context.fillStyle = 'black';
  context.shadowColor = 'black';
  context.shadowBlur = 7;
  context.lineWidth = 5;

  context.fillText(
    '© OpenStreetMap contributors © koenverhoeven on Wikiloc ',
    6,
    canvas.height - 4
  );

  context.shadowBlur = 0;
  context.fillStyle = 'white';
  context.fillText(
    '© OpenStreetMap contributors © koenverhoeven on Wikiloc ',
    5,
    canvas.height - 5
  );

  context.shadowBlur = 0;
  context.fillStyle = 'white';
  context.fillText(
    `${feature.getProperties().name} to ${nextFeature.getProperties().name}`,
    5,
    20
  );
};

export const getMultiStagePDF = async (
  map: OLMap,
  format: PDFFormat,
  resolution: number,
  stageFeatures: Feature<Point>[],
  onLoadStart: () => void,
  onLoadEnd: () => void
): Promise<jsPDF | undefined> => {
  const features = stageFeatures.slice(0, -1);
  onLoadStart();
  let pdf: jsPDF | undefined = undefined;
  for (let i = 0; i < features.length; i++) {
    const extent = boundingExtent([
      stageFeatures[i].getGeometry().getCoordinates(),
      stageFeatures[i + 1].getGeometry().getCoordinates(),
    ]);

    pdf = await exportMapToPDF(
      map,
      pdf,
      format,
      resolution,
      false,
      extent,
      (canvas) => {
        addPDFTextToCanvas(canvas, stageFeatures[i], stageFeatures[i + 1]);
        return undefined;
      }
    );
    if (i < stageFeatures.length - 2) {
      pdf.addPage();
    }
  }
  onLoadEnd();
  return pdf;
};

export const getCurrentViewPDF = async (
  map: OLMap,
  format: PDFFormat,
  resolution: number,
  onLoadStart: () => void,
  onLoadEnd: () => void
): Promise<jsPDF> => {
  onLoadStart();
  const size = map.getSize();
  const extent = map.getView().calculateExtent(size);
  const pdf = await exportMapToPDF(
    map,
    undefined,
    format,
    resolution,
    false,
    extent
  );
  onLoadEnd();
  return pdf;
};
