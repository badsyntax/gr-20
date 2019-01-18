import React from 'react';
import { FaCaretLeft } from 'react-icons/fa';

import ButtonControl from '../ButtonControl/ButtonControlComponent';

const PrevPointButtonControl = props => (
  <ButtonControl {...props}>
    <FaCaretLeft />
  </ButtonControl>
);

export default PrevPointButtonControl;
