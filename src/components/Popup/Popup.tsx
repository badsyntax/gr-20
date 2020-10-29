import classNames from 'classnames/bind';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import React, { useEffect, useRef } from 'react';
import { Popover } from 'reactstrap';
import { ANIMATION_DURATION } from './constants';
import STYLES from './Popup.module.scss';
import { PopupContent } from './PopupContent';

const c = classNames.bind(STYLES);

interface PopupProps {
  map: Map;
  isOpen: boolean;
  onClose: () => void;
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  prevFeature?: Feature<Point>;
  nextFeature?: Feature<Point>;
  selectFeature: (feature: Feature<Point>) => void;
}

export const Popup: React.FunctionComponent<PopupProps> = ({
  map,
  gpxVectorLayer,
  onClose,
  isOpen,
  feature,
  nextFeature,
  prevFeature,
  selectFeature,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay>();
  const coordinates = feature.getGeometry().getCoordinates();

  useEffect(() => {
    overlayRef.current = new Overlay({
      element: containerRef.current as HTMLElement,
      positioning: OverlayPositioning.CENTER_CENTER,
    });
    map.addOverlay(overlayRef.current);
  }, [map]);

  useEffect(() => {
    overlayRef.current?.setPosition(coordinates);
    map.getView().animate({
      center: coordinates,
      duration: ANIMATION_DURATION,
    });
  }, [map, feature, coordinates]);

  return (
    <div id="popover-container" ref={containerRef}>
      <Popover
        placement="top"
        isOpen={isOpen}
        target={containerRef}
        container={containerRef}
        className={c('Popup')}
        modifiers={{
          hide: { enabled: false },
          preventOverflow: { enabled: false },
          flip: { enabled: false },
        }}
      >
        {({ scheduleUpdate }) => {
          return (
            <PopupContent
              map={map}
              onClose={onClose}
              gpxVectorLayer={gpxVectorLayer}
              feature={feature}
              nextFeature={nextFeature}
              prevFeature={prevFeature}
              scheduleUpdate={scheduleUpdate}
              coordinates={coordinates}
              buttonClassName={c('Popup__button-control')}
              selectFeature={selectFeature}
            />
          );
        }}
      </Popover>
    </div>
  );
};
