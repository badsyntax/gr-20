import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaFilePdf } from 'react-icons/fa';

import Map from 'ol/Map';

import ButtonControl from '../ButtonControl/ButtonControl';
import { exportMapToPDF } from '../../util/util';

export interface PdfExportButtonControlProps {
  map: Map;
  tooltip: string;
}

export const PdfExportButtonControl: React.FunctionComponent<PdfExportButtonControlProps> = ({
  map,
  tooltip,
  ...rest
}) => {
  const onButtonCLick = async () => {
    // showSpinner(true);
    const pdf = await exportMapToPDF(map);
    pdf.save('map.pdf');
    // showSpinner(false);
  };

  return (
    <ButtonControl
      iconName="PDF"
      tooltip={tooltip}
      onClick={onButtonCLick}
      {...rest}
    >
      <FaFilePdf />
    </ButtonControl>
  );
};

PdfExportButtonControl.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

export default PdfExportButtonControl;
