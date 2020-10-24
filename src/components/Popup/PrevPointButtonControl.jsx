import React from 'react';
import { FaCaretLeft } from 'react-icons/fa';

import ButtonControl from '../ButtonControl/ButtonControl';

const PrevPointButtonControl = (props) => (
  <ButtonControl {...props}>
    <FaCaretLeft />
  </ButtonControl>
);

export default PrevPointButtonControl;
