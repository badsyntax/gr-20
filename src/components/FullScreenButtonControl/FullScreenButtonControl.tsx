import Map from 'ol/Map';
import React from 'react';
import { MdZoomOutMap } from 'react-icons/md';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';

export interface FullScreenButtonControlProps {
  map: Map;
}

export const FullScreenButtonControl: React.FunctionComponent<
  FullScreenButtonControlProps & Omit<ButtonControlProps, 'onClick'>
> = (props) => (
  <ButtonControl
    {...props}
    tooltipPlacement="right"
    onClick={() => alert('fullscreen')}
  >
    <MdZoomOutMap />
  </ButtonControl>
);
