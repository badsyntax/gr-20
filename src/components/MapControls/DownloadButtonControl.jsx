import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IoMdDownload } from 'react-icons/io';
import Map from 'ol/Map';
import { saveAs } from 'file-saver';
import { boundingExtent } from 'ol/extent';
import { getSortedPointFeatures, getLayerById } from '../../util/util';

import ButtonControl from '../ButtonControl/ButtonControl';

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

class DownloadButtonControl extends Component {
  onButtonCLick = async () => {
    const { map, showSpinner } = this.props;
    const vectorLayer = getLayerById(map, 'gpxvectorlayer');

    showSpinner(true);

    const {
      default: JSPDF,
    } = await import(/* webpackChunkName: "jspdf" */ 'jspdf');

    const {
      default: JSZip,
    } = await import(/* webpackChunkName: "jszip" */ 'jszip');

    const source = vectorLayer.getSource();
    const sortedPointsFeatures = getSortedPointFeatures(vectorLayer);
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

    await sortedPointsFeatures.slice(0, sortedPointsFeatures.length - 1).reduce(
      (promise, sortedPoint, index) =>
        promise.then(
          result =>
            new Promise(resolve => {
              showSpinner(true);
              const extent = boundingExtent([
                sortedPoint.featurePoint.getGeometry().getCoordinates(),
                sortedPointsFeatures[index + 1].featurePoint
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
                    sortedPointsFeatures[index + 1].featurePoint.getProperties()
                      .name
                  }`,
                  5,
                  20
                );

                const data = canvas.toDataURL('image/jpeg');
                pdf.text(0, 0, 'page ');
                pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
                if (index < sortedPointsFeatures.length - 2) {
                  pdf.addPage();
                }
                resolve();
                showSpinner(false);
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
    showSpinner(false);
  };

  render() {
    const { map, showSpinner, vectorLayer, ...rest } = this.props;
    return (
      <ButtonControl onClick={this.onButtonCLick} {...rest}>
        <IoMdDownload />
      </ButtonControl>
    );
  }
}

DownloadButtonControl.propTypes = {
  showSpinner: PropTypes.func.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
};

export default DownloadButtonControl;
