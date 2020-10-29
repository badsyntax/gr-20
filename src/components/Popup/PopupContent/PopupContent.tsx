import React, { Fragment, useEffect } from 'react';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { MdHome } from 'react-icons/md';
import { PopoverHeader } from 'reactstrap';
import { getDataFromCoords } from '../../../util/util';
import { CloseControlButton } from '../../ControlButtons/CloseControlButton/CloseControlButton';
import { PopupFooter } from '../PopupFooter/PopupFooter';
import { PopupBody } from '../PopupBody/PopupBody';

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
        <CloseControlButton onClick={onClose} />
        <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
        {!prevFeature && ' (Start)'}
        {!nextFeature && ' (Finish)'}
      </PopoverHeader>
      <PopupBody
        lon={lon}
        lat={lat}
        hdms={hdms}
        elevation={elevation}
        gpxVectorLayer={gpxVectorLayer}
        feature={feature}
        nextFeature={nextFeature}
        prevFeature={prevFeature}
        scheduleUpdate={scheduleUpdate}
      />
      <PopupFooter
        map={map}
        lonLat={lonLat}
        name={name}
        nextFeature={nextFeature}
        prevFeature={prevFeature}
        buttonClassName={buttonClassName}
        onPrevPointButtonClick={onPrevPointButtonClick}
        onNextPointButtonClick={onNextPointButtonClick}
        google360Url={google360Url}
      />
    </Fragment>
  );
};
