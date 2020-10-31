import { default as OLMap } from 'ol/Map';
import React from 'react';
import { useDispatch } from 'react-redux';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { hideSpinner, showSpinner } from '../../../features/spinner';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export interface PdfExportControlButtonProps {
  map: OLMap;
}

export const PdfExportControlButton: React.FunctionComponent<
  PdfExportControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = ({ map, ...rest }) => {
  const dispatch = useDispatch();

  const onButtonCLick = async () => {
    dispatch(showSpinner());
    const { exportMapToPDF } = await import(
      /* webpackChunkName: "pdf-util" */ '../../../util/pdf'
    );
    const pdf = await exportMapToPDF(map);
    pdf.save('map.pdf');
    dispatch(hideSpinner());
  };

  return (
    <ControlButton onClick={onButtonCLick} {...rest}>
      <PictureAsPdfIcon />
    </ControlButton>
  );
};
