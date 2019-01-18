import React from 'react';

import { MdZoomIn } from 'react-icons/md';

import ButtonControl from '../ButtonControl/ButtonControlComponent';

const ZoomInButtonControl = props => (
  <ButtonControl {...props}>
    <MdZoomIn />
  </ButtonControl>
);

export default ZoomInButtonControl;
