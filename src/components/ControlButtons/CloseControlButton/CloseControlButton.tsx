import React, { memo } from 'react';
// import { FaTimes } from 'react-icons/fa';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const CloseControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  (props) => <ControlButton {...props}>X{/* <FaTimes /> */}</ControlButton>
);
