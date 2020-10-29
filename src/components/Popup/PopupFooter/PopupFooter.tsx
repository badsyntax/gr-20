import { Coordinate } from 'ol/coordinate';
import React from 'react';
import { default as OLMap } from 'ol/Map';
import classNames from 'classnames/bind';

import { ZoomInControlButton } from '../../ControlButtons/ZoomInControlButton/ZoomInControlButton';
import Google360ControlButton from '../../ControlButtons/Google360ControlButton/Google360ControlButton';
import { NextPointControlButton } from '../../ControlButtons/NextPointControlButton/NextPointControlButton';
import { PrevPointControlButton } from '../../ControlButtons/PrevPointControlButton/PrevPointControlButton';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import STYLES from './PopupFooter.module.scss';

const c = classNames.bind(STYLES);

export interface PopupFooterProps {
  map: OLMap;
  lonLat: Coordinate;
  buttonClassName: string;
  onPrevPointButtonClick: () => void;
  onNextPointButtonClick: () => void;
  prevFeature?: Feature<Point>;
  nextFeature?: Feature<Point>;
  google360Url: string;
  name: string;
}

export const PopupFooter: React.FunctionComponent<PopupFooterProps> = ({
  map,
  lonLat,
  buttonClassName,
  onPrevPointButtonClick,
  onNextPointButtonClick,
  prevFeature,
  nextFeature,
  google360Url,
  name,
}) => {
  return (
    <footer className={c('footer')}>
      <ZoomInControlButton
        lonLat={lonLat}
        map={map}
        tooltip="Zoom to Point"
        className={buttonClassName}
      />
      <PrevPointControlButton
        onClick={onPrevPointButtonClick}
        tooltip="Previous Point"
        className={buttonClassName}
        disabled={!prevFeature}
      />
      <NextPointControlButton
        onClick={onNextPointButtonClick}
        tooltip="Next Point"
        className={buttonClassName}
        disabled={!nextFeature}
      />
      {google360Url && name && (
        <Google360ControlButton
          tooltip="View 360"
          pointName={name}
          embedUrl={google360Url}
          className={buttonClassName}
        />
      )}
    </footer>
  );
};
