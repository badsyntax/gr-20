import React, { memo } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const PrevPointControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  (props) => (
    <ControlButton {...props}>
      <ArrowBackIcon />
    </ControlButton>
  )
);
