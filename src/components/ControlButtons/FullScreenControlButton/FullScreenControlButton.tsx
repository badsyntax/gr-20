import { default as OLMap } from 'ol/Map';
import React from 'react';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export interface FullScreenControlButtonProps {
  map: OLMap;
}

export const FullScreenControlButton: React.FunctionComponent<
  FullScreenControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = (props) => (
  <ControlButton {...props} onClick={() => alert('fullscreen')}>
    Full screen
  </ControlButton>
);
