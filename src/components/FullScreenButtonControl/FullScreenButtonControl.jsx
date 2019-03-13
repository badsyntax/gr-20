import React from 'react';

import { MdZoomOutMap } from 'react-icons/md';
import ButtonControl from '../ButtonControl/ButtonControl';

const FullScreenButtonControl = props => (
  <ButtonControl
    tooltipPlacement="right"
    {...props}
    onClick={() => alert('fullscnree')}
  >
    <MdZoomOutMap />
  </ButtonControl>
);

export default FullScreenButtonControl;
