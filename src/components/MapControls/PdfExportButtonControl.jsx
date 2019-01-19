import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaFilePdf } from 'react-icons/fa';

import Map from 'ol/Map';

import ButtonControl from '../ButtonControl/ButtonControl';

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

class PdfExportButtonControl extends Component {
  onButtonCLick = async () => {
    const { map, showSpinner } = this.props;
    showSpinner(true);
    const {
      default: JSPDF,
    } = await import(/* webpackChunkName: "jspdf" */ 'jspdf');
    setTimeout(() => {
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
        const pdf = new JSPDF('landscape', undefined, format);
        pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        pdf.save('map.pdf');
        // Reset original map size
        map.setSize(size);
        map.getView().fit(extent, { size });
        showSpinner(false);
      });

      // Set print size
      const printSize = [width, height];
      map.setSize(printSize);
      map.getView().fit(extent, { size: printSize });
    }, 200);
  };

  render() {
    const { map, showSpinner, vectorLayer, ...rest } = this.props;
    return (
      <ButtonControl
        tooltipPlacement="right"
        onClick={this.onButtonCLick}
        {...rest}
      >
        <FaFilePdf />
      </ButtonControl>
    );
  }
}

PdfExportButtonControl.propTypes = {
  showSpinner: PropTypes.func.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
};

export default PdfExportButtonControl;
