import { saveAs } from 'file-saver';
import type JSZip from 'jszip/index.d';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import { getCurrentViewPDF, getMultiStagePDF, PDFFormat } from './pdf';
import { getSortedPointFeatures } from './util';

export const PDF_OPTION_ALL = 'all';
export const PDF_OPTION_CURRENT = 'current';

export const addGPXToZip = async (
  source: VectorSource,
  zip: JSZip
): Promise<void> => {
  const gpxFileUrl = source.getUrl();
  if (typeof gpxFileUrl === 'string') {
    const gpxFileResponse = await fetch(gpxFileUrl);
    const gpxText = await gpxFileResponse.text();
    const fileName = gpxFileUrl.split('/').pop();
    if (fileName) {
      zip.file(fileName, gpxText);
    }
  }
};

export const addPDFToZip = async (
  map: Map,
  vectorSource: VectorSource,
  zip: JSZip,
  onLoadStart: () => void,
  onLoadEnd: () => void,
  fileName = 'map.pdf',
  format: PDFFormat = 'a4',
  resolution = 150,
  option = PDF_OPTION_ALL
): Promise<void> => {
  const sortedPointsFeatures = getSortedPointFeatures(vectorSource);

  const finalPDF =
    option === PDF_OPTION_ALL
      ? await getMultiStagePDF(
          map,
          format,
          resolution,
          sortedPointsFeatures,
          onLoadStart,
          onLoadEnd
        )
      : await getCurrentViewPDF(
          map,
          format,
          resolution,
          onLoadStart,
          onLoadEnd
        );

  if (finalPDF) {
    zip.file(fileName, finalPDF.output('blob'));
  }
};

export const downloadZipFile = async (
  map: Map,
  source: VectorSource,
  includeGPX: boolean,
  includePDF: boolean,
  pdfFormat: PDFFormat,
  pdfResolution: number,
  pdfOption: string,
  onLoadStart: () => void,
  onLoadEnd: () => void
): Promise<void> => {
  onLoadStart();

  const { default: Zip } = await import(
    /* webpackChunkName: "jszip" */ 'jszip'
  );

  const size = map.getSize();
  const initialExtent = map.getView().calculateExtent(size);
  const gpxFileUrl = source.getUrl();
  if (typeof gpxFileUrl !== 'string') {
    return;
  }
  const zipFileName = gpxFileUrl.split('/').pop();
  if (!zipFileName) {
    return;
  }
  const zip = new Zip();
  const rootZipDir = zip.folder(zipFileName);

  if (includeGPX && rootZipDir) {
    await addGPXToZip(source, rootZipDir);
  }
  if (includePDF && rootZipDir) {
    await addPDFToZip(
      map,
      source,
      rootZipDir,
      onLoadStart,
      onLoadEnd,
      'foo.pdf',
      pdfFormat,
      pdfResolution,
      pdfOption
    );
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${zipFileName}.zip`);
  map.setSize(size);
  map.getView().fit(initialExtent, { size });
  onLoadEnd();
};
