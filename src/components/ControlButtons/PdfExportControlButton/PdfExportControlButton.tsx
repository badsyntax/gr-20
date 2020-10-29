import Map from 'ol/Map';
import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../features/spinner';
import { exportMapToPDF } from '../../../util/pdf';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export interface PdfExportControlButtonProps {
  map: Map;
}

export const PdfExportControlButton: React.FunctionComponent<
  PdfExportControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = ({ map, ...rest }) => {
  const dispatch = useDispatch();

  const onButtonCLick = async () => {
    dispatch(showSpinner());
    const pdf = await exportMapToPDF(map);
    pdf.save('map.pdf');
    dispatch(hideSpinner());
  };

  return (
    <ControlButton tooltipPlacement="right" onClick={onButtonCLick} {...rest}>
      <FaFilePdf />
    </ControlButton>
  );
};
