import React, { memo } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const NextPointControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  (props) => (
    <ControlButton {...props}>
      <FaCaretRight />
    </ControlButton>
  )
);
