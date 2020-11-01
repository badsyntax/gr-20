import React from 'react';
import { default as OLMap } from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { NextPointControlButton } from '../ControlButtons/NextPointControlButton/NextPointControlButton';
import { PrevPointControlButton } from '../ControlButtons/PrevPointControlButton/PrevPointControlButton';
import { ZoomToPointControlButton } from '../ControlButtons/ZoomToPointControlButton/ZoomToPointControlButton';
import { Google360ControlButton } from '../ControlButtons/Google360ControlButton/Google360ControlButton';
import { getDataFromCoords } from '../../util/util';
import { useStyles } from './WaypointControlButtons.styles';

export interface WaypointControlButtonsProps {
  map: OLMap;
  feature: Feature<Point>;
  prevFeature?: Feature<Point>;
  nextFeature?: Feature<Point>;
  selectFeature: (feature: Feature<Point>) => void;
}

export const WaypointControlButtons: React.FunctionComponent<WaypointControlButtonsProps> = ({
  map,
  prevFeature,
  nextFeature,
  feature,
  selectFeature,
}) => {
  const classes = useStyles();
  const { name, google360Url } = feature.getProperties();
  const { lonLat } = getDataFromCoords(feature.getGeometry().getCoordinates());
  const onPrevPointButtonClick = () => {
    if (prevFeature) {
      selectFeature(prevFeature);
    }
  };
  const onNextPointButtonClick = () => {
    if (nextFeature) {
      selectFeature(nextFeature);
    }
  };
  return (
    <ButtonGroup
      size="large"
      variant="text"
      orientation="horizontal"
      className={classes.root}
      fullWidth
      disableElevation
    >
      <ZoomToPointControlButton
        lonLat={lonLat}
        map={map}
        label="Zoom to Point"
      />
      <Google360ControlButton
        label="View 360"
        pointName={name}
        embedUrl={google360Url}
        disabled={!google360Url}
      />
      <PrevPointControlButton
        onClick={onPrevPointButtonClick}
        label="Previous Point"
        disabled={!prevFeature}
      />
      <NextPointControlButton
        onClick={onNextPointButtonClick}
        label="Next Point"
        disabled={!nextFeature}
      />
    </ButtonGroup>
  );
};
