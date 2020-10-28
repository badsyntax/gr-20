import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import React, { memo } from 'react';
import { MdZoomIn } from 'react-icons/md';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';

export const ANIMATION_DURATION = 800;

export interface ZoomInButtonControlProps {
  lonLat: Coordinate;
  map: Map;
}

export const ZoomInButtonControl: React.FunctionComponent<
  ZoomInButtonControlProps & Omit<ButtonControlProps, 'onClick'>
> = memo(({ lonLat, map, ...rest }) => {
  const onClick = () => {
    map.getView().animate({
      center: fromLonLat(lonLat),
      zoom: 18,
      duration: ANIMATION_DURATION,
    });
  };
  return (
    <ButtonControl {...rest} onClick={onClick}>
      <MdZoomIn />
    </ButtonControl>
  );
});
