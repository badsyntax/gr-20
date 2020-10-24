import { saveAs } from 'file-saver';
import { boundingExtent } from 'ol/extent';

import { exportMapToPDF, getSortedPointFeatures, getLayerById } from './util';

export const PDF_OPTION_ALL = 'all';
export const PDF_OPTION_CURRENT = 'current';

export const addGPXToZip = async (source, zip) => {
  const gpxFileUrl = source.getUrl();
  const gpxFileResponse = await fetch(gpxFileUrl);
  const gpxText = await gpxFileResponse.text();
  const fileName = gpxFileUrl.split('/').pop();
  zip.file(fileName, gpxText);
};

export const addPDFTextToCanvas = (
  canvas,
  sortedPoint,
  sortedPointsFeatures,
  index
) => {
  const context = canvas.getContext('2d');

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
    `${sortedPoint.featurePoint.getProperties().name} to ${
      sortedPointsFeatures[index + 1].featurePoint.getProperties().name
    }`,
    5,
    20
  );
};

export const getMultiStagePDF = (
  map,
  format,
  resolution,
  stageFeatures,
  onLoadStart,
  onLoadEnd
) =>
  stageFeatures.slice(0, -1).reduce(async (promise, stageFeature, index) => {
    let pdf = await promise;
    onLoadStart();

    const extent = boundingExtent([
      stageFeature.featurePoint.getGeometry().getCoordinates(),
      stageFeatures[index + 1].featurePoint.getGeometry().getCoordinates(),
    ]);

    pdf = await exportMapToPDF(
      map,
      format,
      resolution,
      false,
      extent,
      pdf,
      (canvas) => {
        addPDFTextToCanvas(canvas, stageFeature, stageFeatures, index);
      }
    );
    if (index < stageFeatures.length - 2) {
      pdf.addPage();
    }
    onLoadEnd();
    return pdf;
  }, Promise.resolve(null));

export const getCurrentViewPDF = async (
  map,
  format,
  resolution,
  sortedPointsFeatures,
  onLoadStart,
  onLoadEnd
) => {
  onLoadStart();
  const size = map.getSize();
  const extent = map.getView().calculateExtent(size);
  const pdf = await exportMapToPDF(map, format, resolution, false, extent);
  onLoadEnd();
  return pdf;
};

export const addPDFToZip = async (
  map,
  format = 'a4',
  resolution = 150,
  option = PDF_OPTION_ALL,
  zip,
  onLoadStart,
  onLoadEnd,
  fileName = 'map.pdf'
) => {
  const vectorLayer = getLayerById(map, 'gpxvectorlayer');
  const sortedPointsFeatures = getSortedPointFeatures(vectorLayer);

  const pdfArgs = [
    map,
    format,
    resolution,
    sortedPointsFeatures,
    onLoadStart,
    onLoadEnd,
  ];

  const finalPDF =
    option === PDF_OPTION_ALL
      ? await getMultiStagePDF(...pdfArgs)
      : await getCurrentViewPDF(...pdfArgs);

  zip.file(fileName, finalPDF.output('blob'));
};

export const downloadZipFile = async (
  map,
  includeGPX,
  includePDF,
  pdfFormat,
  pdfResolution,
  pdfOption,
  onLoadStart,
  onLoadEnd
) => {
  onLoadStart();

  const { default: JSZip } = await import(
    /* webpackChunkName: "jszip" */ 'jszip'
  );

  const vectorLayer = getLayerById(map, 'gpxvectorlayer');
  const source = vectorLayer.getSource();
  const size = map.getSize();
  const initialExtent = map.getView().calculateExtent(size);
  const gpxFileUrl = source.getUrl();
  const zipFileName = gpxFileUrl.split('/').pop();
  const zip = new JSZip();
  const rootZipDir = zip.folder(zipFileName);

  if (includeGPX) {
    await addGPXToZip(source, rootZipDir);
  }
  if (includePDF) {
    await addPDFToZip(
      map,
      pdfFormat,
      pdfResolution,
      pdfOption,
      rootZipDir,
      onLoadStart,
      onLoadEnd
    );
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${zipFileName}.zip`);
  map.setSize(size);
  map.getView().fit(initialExtent, { size });
  onLoadEnd();
};
