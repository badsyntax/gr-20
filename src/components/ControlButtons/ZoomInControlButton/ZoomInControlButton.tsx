import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import React, { memo } from 'react';
import { MdZoomIn } from 'react-icons/md';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export const ANIMATION_DURATION = 800;

export interface ZoomInControlButtonProps {
  lonLat: Coordinate;
  map: Map;
}

export const ZoomInControlButton: React.FunctionComponent<
  ZoomInControlButtonProps & Omit<ControlButtonProps, 'onClick'>
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
      <MdZoomIn />
    </ControlButton>
  );
});
