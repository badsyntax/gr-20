import React, { memo } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const NextPointControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  (props) => (
    <ControlButton {...props}>
      <ArrowForwardIcon />
    </ControlButton>
  )
);
