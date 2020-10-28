import React, { memo } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';

export const NextPointButtonControl: React.FunctionComponent<ButtonControlProps> = memo(
  (props) => (
    <ButtonControl {...props}>
      <FaCaretRight />
    </ButtonControl>
  )
);
