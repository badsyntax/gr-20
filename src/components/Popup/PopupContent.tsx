import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import React, { Fragment, useEffect } from 'react';
import { MdHome } from 'react-icons/md';
import { PopoverBody, PopoverHeader } from 'reactstrap';
import { getDataFromCoords } from '../../util/util';
import { CloseButtonControl } from './CloseButtonControl';
import Google360ButtonControl from './Google360ButtonControl';
import { NextPoint } from './NextPoint';
import { NextPointButtonControl } from './NextPointButtonControl';
import { PrevPointButtonControl } from './PrevPointButtonControl';
import { ZoomInButtonControl } from './ZoomInButtonControl';

export interface PopupContentProps {
  map: Map;
  scheduleUpdate: () => void;
  onClose: () => void;
  selectFeature: (feature: Feature<Point>) => void;
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  buttonClassName: string;
  coordinates: Coordinate;
  prevFeature?: Feature<Point>;
  nextFeature?: Feature<Point>;
}

export const PopupContent: React.FunctionComponent<PopupContentProps> = ({
  map,
  scheduleUpdate,
  onClose,
  gpxVectorLayer,
  feature,
  prevFeature,
  nextFeature,
  buttonClassName,
  coordinates,
  selectFeature,
}) => {
  const { lonLat, hdms, elevation } = getDataFromCoords(coordinates);
  const { name, google360Url } = feature.getProperties();
  const lon = (lonLat[0] || 0).toFixed(6);
  const lat = (lonLat[1] || 0).toFixed(6);

  const onNextPointButtonClick = () => {
    if (nextFeature) {
      selectFeature(nextFeature);
    }
  };

  const onPrevPointButtonClick = () => {
    if (prevFeature) {
      selectFeature(prevFeature);
    }
  };

  useEffect(() => {
    scheduleUpdate();
  }, [coordinates, scheduleUpdate]);
  return (
    <Fragment>
      <PopoverHeader>
        <CloseButtonControl onClick={onClose} />
        <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
      </PopoverHeader>
      <PopoverBody>
        <div>Elevation: {elevation}m</div>
        <div>Longitude: {lon}</div>
        <div>Latitude: {lat}</div>
        <div>Coordinates: {hdms}</div>
        {nextFeature && (
          <NextPoint
            gpxVectorLayer={gpxVectorLayer}
            feature={feature}
            nextFeature={nextFeature}
          />
        )}
        <div style={{ paddingTop: '0.5rem' }}>
          <ZoomInButtonControl
            lonLat={lonLat}
            map={map}
            tooltip="Zoom to Point"
            className={buttonClassName}
          />
          {prevFeature && (
            <PrevPointButtonControl
              onClick={onPrevPointButtonClick}
              tooltip="Previous Point"
              className={buttonClassName}
            />
          )}
          {nextFeature && (
            <NextPointButtonControl
              onClick={onNextPointButtonClick}
              tooltip="Next Point"
              className={buttonClassName}
            />
          )}
          {google360Url && name && (
            <Google360ButtonControl
              tooltip="View 360"
              pointName={name}
              embedUrl={google360Url}
              className={buttonClassName}
            />
          )}
        </div>
      </PopoverBody>
    </Fragment>
  );
};
