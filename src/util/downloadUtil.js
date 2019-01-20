import { saveAs } from 'file-saver';
import { boundingExtent } from 'ol/extent';

import { exportMapToPDF, getSortedPointFeatures, getLayerById } from './util';

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

export const addPDFToZip = async (
  map,
  format = 'a4',
  resolution = 150,
  zip
) => {
  const vectorLayer = getLayerById(map, 'gpxvectorlayer');
  const sortedPointsFeatures = getSortedPointFeatures(vectorLayer);

  const finalPDF = await sortedPointsFeatures
    .slice(0, sortedPointsFeatures.length - 1)
    .reduce(
      (promise, sortedPoint, index) =>
        promise.then(
          pdf =>
            new Promise(async resolve => {
              const extent = boundingExtent([
                sortedPoint.featurePoint.getGeometry().getCoordinates(),
                sortedPointsFeatures[index + 1].featurePoint
                  .getGeometry()
                  .getCoordinates(),
              ]);

              // eslint-disable-next-line no-param-reassign
              pdf = await exportMapToPDF(
                map,
                format,
                resolution,
                false,
                extent,
                pdf,
                canvas => {
                  addPDFTextToCanvas(
                    canvas,
                    sortedPoint,
                    sortedPointsFeatures,
                    index
                  );
                }
              );
              if (index < sortedPointsFeatures.length - 2) {
                pdf.addPage();
              }

              resolve(pdf);
            })
        ),
      Promise.resolve(null)
    );

  zip.file('map.pdf', finalPDF.output('blob'));
};

export const downloadZipFile = async (
  map,
  includeGPX,
  includePDF,
  pdfFormat,
  pdfResolution
) => {
  const {
    default: JSZip,
  } = await import(/* webpackChunkName: "jszip" */ 'jszip');

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
    await addPDFToZip(map, pdfFormat, pdfResolution, rootZipDir);
  }

  return new Promise(resolve => {
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${zipFileName}.zip`);
      map.setSize(size);
      map.getView().fit(initialExtent, { size });
      resolve();
    });
  });
};
