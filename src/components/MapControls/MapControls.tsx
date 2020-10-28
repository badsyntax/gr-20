import classNames from 'classnames/bind';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, { createRef, useEffect } from 'react';
import { DownloadButtonControl } from '../DownloadButtonControl/DownloadButtonControl';
import { MyLocationButtonControl } from '../MyLocationButtonControl/MyLocationButtonControl';
import { PdfExportButtonControl } from '../PdfExportButtonControl/PdfExportButtonControl';
import { ZoomToExtentButtonControl } from '../ZoomToExtentButtonControl/ZoomToExtentButtonControl';
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
      <ZoomToExtentButtonControl tooltip="Fit Extent" {...buttonProps} />
      {/* <FullScreenButtonControl tooltip="Toggle full-screen" {...buttonProps} /> */}
      <PdfExportButtonControl tooltip="Export to PDF" {...buttonProps} />
      <DownloadButtonControl
        tooltip="Download Route and Maps"
        source={source}
        {...buttonProps}
      />
      {/* <GetLinkButtonControl tooltip="Get Shareable Link" {...buttonProps} /> */}
      <MyLocationButtonControl tooltip="Show My Location" {...buttonProps} />
      {/* <ControlIcon target={rotateNorthButton}>
          <MdRotateLeft />
        </ControlIcon> */}
    </div>
  );
};
