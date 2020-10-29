import Map from 'ol/Map';
import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../features/spinner';
import { exportMapToPDF } from '../../../util/pdf';
import {
  ButtonControl,
  ButtonControlProps,
} from '../../ButtonControl/ButtonControl';

export interface PdfExportButtonControlProps {
  map: Map;
}

export const PdfExportButtonControl: React.FunctionComponent<
  PdfExportButtonControlProps & Omit<ButtonControlProps, 'onClick'>
> = ({ map, ...rest }) => {
  const dispatch = useDispatch();

  const onButtonCLick = async () => {
    dispatch(showSpinner());
    const pdf = await exportMapToPDF(map);
    pdf.save('map.pdf');
    dispatch(hideSpinner());
  };

  return (
    <ButtonControl tooltipPlacement="right" onClick={onButtonCLick} {...rest}>
      <FaFilePdf />
    </ButtonControl>
  );
};
