import { default as OLMap } from 'ol/Map';
import React, { memo } from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const ANIMATION_DURATION = 250;

export interface ZoomInControlButtonProps {
  map: OLMap;
}

export const ZoomInControlButton: React.FunctionComponent<
  ZoomInControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = memo(({ map, ...rest }) => {
  const onClick = () => {
    map.getView().animate({
      zoom: map.getView().getZoom() + 0.5,
      duration: ANIMATION_DURATION,
    });
  };
  return (
    <ControlButton {...rest} tooltipPlacement="left" onClick={onClick}>
      <ZoomInIcon />
    </ControlButton>
  );
});
