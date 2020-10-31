import { default as OLMap } from 'ol/Map';
import React from 'react';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

const ANIMATION_DURATION = 1000;

interface ZoomToExtentControlButtonProps {
  map: OLMap;
}

export const ZoomToExtentControlButton: React.FunctionComponent<
  ZoomToExtentControlButtonProps & Omit<ControlButtonProps, 'onClick'>
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
    <ControlButton onClick={onButtonCLick} {...rest}>
      <ZoomOutMapIcon />
    </ControlButton>
  );
};
