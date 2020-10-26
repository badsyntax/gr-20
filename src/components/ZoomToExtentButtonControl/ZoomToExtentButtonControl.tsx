import React from 'react';
import Map from 'ol/Map';
import ButtonControl from '../ButtonControl/ButtonControl';

const ANIMATION_DURATION = 1000;

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

export interface ZoomToExtentButtonControlProps {
  map: Map;
  tooltip: string;
}

const ZoomToExtentButtonControl: React.FunctionComponent<ZoomToExtentButtonControlProps> = ({
  map,
  tooltip,
}) => {
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
    <ButtonControl
      tooltip={tooltip}
      iconName="ZoomToFit"
      onClick={onButtonCLick}
    />
  );
};

export default ZoomToExtentButtonControl;
