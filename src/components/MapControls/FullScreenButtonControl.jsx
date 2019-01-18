import React from 'react';

import { MdZoomOutMap } from 'react-icons/md';
import ButtonControl from '../ButtonControl/ButtonControl';

const FullScreenButtonControl = props => (
  <ButtonControl {...props}>
    <MdZoomOutMap />
  </ButtonControl>
);

export default FullScreenButtonControl;
