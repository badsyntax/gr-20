// import jsPDF from 'jspdf/types/index';
import { boundingExtent, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import SimpleGeometry from 'ol/geom/SimpleGeometry';
import Map from 'ol/Map';
import { Size } from 'ol/size';

export const PDFDims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

export type PDFFormat = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5';

export const exportMapToPDF = async (
  map: Map,
  pdf?: unknown,
  format: PDFFormat = 'a4',
  resolution = 150,
  reset = true,
  extent: SimpleGeometry | Extent | null = null,
  onBeforeRender = (context: HTMLCanvasElement) => undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> =>
  new Promise(async (resolve) => {
    if (!pdf) {
      const { default: JSPDF } = await import(
        /* webpackChunkName: "jspdf" */ 'jspdf'
      );
      // eslint-disable-next-line no-param-reassign
      pdf = new JSPDF('landscape', undefined, format);
    }
    const dim = PDFDims[format];
    const size = map.getSize();
    const defaultExtent = map.getView().calculateExtent(size);

    map.once('rendercomplete', (event) => {
      const { canvas } = event.context;
      onBeforeRender(canvas);
      const data = canvas.toDataURL('image/jpeg');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pdf as any)?.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
      if (reset) {
        map.setSize(size);
        map.getView().fit(extent || defaultExtent, { size });
      }
      resolve(pdf);
    });

    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const printSize: Size = [width, height];

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
  map: Map,
  format: PDFFormat,
  resolution: number,
  stageFeatures: Feature<Point>[],
  onLoadStart: () => void,
  onLoadEnd: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | undefined> => {
  const features = stageFeatures.slice(0, -1);
  onLoadStart();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any | undefined = undefined;
  for (let i = 0; i < features.length; i++) {
    const extent = boundingExtent([
      features[i].getGeometry().getCoordinates(),
      features[i + 1].getGeometry().getCoordinates(),
    ]);

    pdf = await exportMapToPDF(
      map,
      pdf,
      format,
      resolution,
      false,
      extent,
      (canvas) => {
        addPDFTextToCanvas(canvas, features[i], features[i + 1]);
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
  map: Map,
  format: PDFFormat,
  resolution: number,
  onLoadStart: () => void,
  onLoadEnd: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
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
