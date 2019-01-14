import { saveAs } from 'file-saver';
import { boundingExtent } from 'ol/extent';
import { getSortedPoints } from '../../util/util';

import ButtonControl from './ButtonControl';

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

export default class DownloadControl extends ButtonControl {
  constructor(options) {
    super(options);
    this.element.firstChild.addEventListener(
      'click',
      this.onButtonCLick,
      false
    );
  }

  setLoadingFunc(loadingFunc) {
    this.loadingFunc = loadingFunc;
  }

  setVectorLayer(vectorLayer) {
    this.vectorLayer = vectorLayer;
  }

  getVectorLayer() {
    return this.vectorLayer;
  }

  getLoadingFunc() {
    return this.loadingFunc;
  }

  onButtonCLick = async () => {
    this.getLoadingFunc()(true);
    const {
      default: JSPDF,
    } = await import(/* webpackChunkName: "jspdf" */ 'jspdf');

    const {
      default: JSZip,
    } = await import(/* webpackChunkName: "jspdf" */ 'jszip');

    const map = this.getMap();
    const source = this.getVectorLayer().getSource();
    const sortedPoints = getSortedPoints(this.getVectorLayer());
    const size = map.getSize();
    const initialExtent = map.getView().calculateExtent(size);

    const format = 'a4';
    const resolution = 150; // dpi
    const dim = dims[format];
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);

    const pdf = new JSPDF('landscape', undefined, format);

    const gpxFileUrl = source.getUrl();
    const gpxFileResponse = await fetch(gpxFileUrl);
    const gpxText = await gpxFileResponse.text();

    const fileName = gpxFileUrl.split('/').pop();
    const zip = new JSZip();
    const rootZipDir = zip.folder(fileName);
    rootZipDir.file(fileName, gpxText);

    await sortedPoints.slice(0, sortedPoints.length - 1).reduce(
      (promise, sortedPoint, index) =>
        promise.then(
          result =>
            new Promise(resolve => {
              this.getLoadingFunc()(true);
              const extent = boundingExtent([
                sortedPoint.featurePoint.getGeometry().getCoordinates(),
                sortedPoints[index + 1].featurePoint
                  .getGeometry()
                  .getCoordinates(),
              ]);
              map.once('rendercomplete', event => {
                const { canvas } = event.context;

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
                    sortedPoints[index + 1].featurePoint.getProperties().name
                  }`,
                  5,
                  20
                );

                const data = canvas.toDataURL('image/jpeg');
                pdf.text(0, 0, 'page ');
                pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
                if (index < sortedPoints.length - 2) {
                  pdf.addPage();
                }
                resolve();
                this.getLoadingFunc()(false);
              });

              // Set print size
              const printSize = [width, height];
              map.setSize(printSize);
              map.getView().fit(extent, { size: printSize });
            })
        ),
      Promise.resolve([])
    );

    rootZipDir.file('map.pdf', pdf.output('blob'));

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${fileName}.zip`);
    });

    map.setSize(size);
    map.getView().fit(initialExtent, { size });
    this.getLoadingFunc()(false);
  };
}
