import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaFilePdf } from 'react-icons/fa';

import Map from 'ol/Map';

import ButtonControl from '../ButtonControl/ButtonControl';
import { exportMapToPDF } from '../../util/util';

class PdfExportButtonControl extends Component {
  onButtonCLick = async () => {
    const { map, showSpinner } = this.props;
    showSpinner(true);
    const pdf = await exportMapToPDF(map);
    pdf.save('map.pdf');
    showSpinner(false);
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
