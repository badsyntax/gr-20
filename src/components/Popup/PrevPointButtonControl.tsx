import React, { memo } from 'react';
import { FaCaretLeft } from 'react-icons/fa';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';

export const PrevPointButtonControl: React.FunctionComponent<ButtonControlProps> = memo(
  (props) => (
    <ButtonControl {...props}>
      <FaCaretLeft />
    </ButtonControl>
  )
);
