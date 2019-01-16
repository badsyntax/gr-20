/* eslint-disable new-cap */
/* Based on code from the OpenLayers examples: https://github.com/openlayers/openlayers/blob/e6ca241a27c9a007395609114b98185870a356ec/examples/export-pdf.js */

import ButtonControl from '../ButtonControl/ButtonControl';

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

export default class PdfExportControl extends ButtonControl {
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

  getLoadingFunc() {
    return this.loadingFunc;
  }

  isLoading(isLoading) {
    return this.getLoadingFunc()(isLoading);
  }

  onButtonCLick = async () => {
    this.isLoading(true);
    const {
      default: jsPDF,
    } = await import(/* webpackChunkName: "jspdf" */ 'jspdf');
    setTimeout(() => {
      const map = this.getMap();
      const format = 'a4';
      const resolution = 150; // dpi
      const dim = dims[format];
      const width = Math.round((dim[0] * resolution) / 25.4);
      const height = Math.round((dim[1] * resolution) / 25.4);
      const size = map.getSize();
      const extent = map.getView().calculateExtent(size);

      map.once('rendercomplete', event => {
        const { canvas } = event.context;
        const data = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        pdf.save('map.pdf');
        // Reset original map size
        map.setSize(size);
        map.getView().fit(extent, { size });
        this.isLoading(false);
      });

      // Set print size
      const printSize = [width, height];
      map.setSize(printSize);
      map.getView().fit(extent, { size: printSize });
    }, 200);
  };
}
