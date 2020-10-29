import React, { memo } from 'react';
import { FaCaretLeft } from 'react-icons/fa';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const PrevPointControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  (props) => (
    <ControlButton {...props}>
      <FaCaretLeft />
    </ControlButton>
  )
);
