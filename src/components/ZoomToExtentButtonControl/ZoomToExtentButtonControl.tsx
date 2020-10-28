import Map from 'ol/Map';
import React from 'react';
import { MdZoomOutMap } from 'react-icons/md';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';

const ANIMATION_DURATION = 1000;

interface ZoomToExtentButtonControlProps {
  map: Map;
}

export const ZoomToExtentButtonControl: React.FunctionComponent<
  ZoomToExtentButtonControlProps & Omit<ButtonControlProps, 'onClick'>
> = ({ map, ...rest }) => {
  const onButtonCLick = () => {
    const view = map.getView();
    view.fit(
      [
        978823.488305482,
        5121096.608475749,
        1039463.1111227559,
        5245134.752643153,
      ],
      {
        duration: ANIMATION_DURATION,
      }
    );
  };

  return (
    <ButtonControl tooltipPlacement="right" onClick={onButtonCLick} {...rest}>
      <MdZoomOutMap />
    </ButtonControl>
  );
};
