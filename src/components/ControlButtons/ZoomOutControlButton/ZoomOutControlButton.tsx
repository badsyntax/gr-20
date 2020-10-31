import { default as OLMap } from 'ol/Map';
import React, { memo } from 'react';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const ANIMATION_DURATION = 250;

export interface ZoomOutControlButtonProps {
  map: OLMap;
}

export const ZoomOutControlButton: React.FunctionComponent<
  ZoomOutControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = memo(({ map, ...rest }) => {
  const onClick = () => {
    map.getView().animate({
      zoom: map.getView().getZoom() - 0.5,
      duration: ANIMATION_DURATION,
    });
  };
  return (
    <ControlButton {...rest} tooltipPlacement="left" onClick={onClick}>
      <ZoomOutIcon />
    </ControlButton>
  );
});
