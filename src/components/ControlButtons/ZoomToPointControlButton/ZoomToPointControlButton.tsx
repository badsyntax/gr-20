import { Coordinate } from 'ol/coordinate';
import { default as OLMap } from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import React, { memo } from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const ANIMATION_DURATION = 800;

export interface ZoomToPointControlButtonProps {
  lonLat: Coordinate;
  map: OLMap;
}

export const ZoomToPointControlButton: React.FunctionComponent<
  ZoomToPointControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = memo(({ lonLat, map, ...rest }) => {
  const onClick = () => {
    map.getView().animate({
      center: fromLonLat(lonLat),
      zoom: 18,
      duration: ANIMATION_DURATION,
    });
  };
  return (
    <ControlButton {...rest} onClick={onClick}>
      <ZoomInIcon />
    </ControlButton>
  );
});
