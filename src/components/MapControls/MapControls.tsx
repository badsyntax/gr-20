import classNames from 'classnames/bind';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, { createRef, useEffect } from 'react';
import { DownloadControlButton } from '../ControlButtons/DownloadControlButton/DownloadControlButton';
import { MyLocationControlButton } from '../ControlButtons/MyLocationControlButton/MyLocationControlButton';
import { PdfExportControlButton } from '../ControlButtons/PdfExportControlButton/PdfExportControlButton';
import { ZoomToExtentControlButton } from '../ControlButtons/ZoomToExtentControlButton/ZoomToExtentControlButton';
import controls, { zoomControl } from './controls';
import STYLES from './MapControls.module.scss';

const c = classNames.bind(STYLES);

export interface MapControlsProps {
  map: Map;
  source: VectorSource;
}

export const MapControls: React.FunctionComponent<MapControlsProps> = ({
  map,
  source,
}) => {
  const zoomContainerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    zoomControl.setTarget(zoomContainerRef.current!);
    controls.forEach((control) => map.addControl(control));
    return () => {
      controls.forEach((control) => map.removeControl(control));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttonProps = {
    map,
    className: c('MapControls__button-control'),
  };
  return (
    <div className={STYLES.MapControls}>
      <div ref={zoomContainerRef} />
      <ZoomToExtentControlButton tooltip="Fit Extent" {...buttonProps} />
      {/* <FullScreenControlButton tooltip="Toggle full-screen" {...buttonProps} /> */}
      <PdfExportControlButton tooltip="Export to PDF" {...buttonProps} />
      <DownloadControlButton
        tooltip="Download Route and Maps"
        source={source}
        {...buttonProps}
      />
      {/* <GetLinkControlButton tooltip="Get Shareable Link" {...buttonProps} /> */}
      <MyLocationControlButton tooltip="Show My Location" {...buttonProps} />
      {/* <ControlIcon target={rotateNorthButton}>
          <MdRotateLeft />
        </ControlIcon> */}
    </div>
  );
};
