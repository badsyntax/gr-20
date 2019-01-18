import React from 'react';
import { FaCaretRight } from 'react-icons/fa';

import ButtonControl from '../ButtonControl/ButtonControl';

const PrevPointButtonControl = props => (
  <ButtonControl {...props}>
    <FaCaretRight />
  </ButtonControl>
);

export default PrevPointButtonControl;
