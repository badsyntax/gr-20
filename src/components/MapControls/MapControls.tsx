import React, { Component, useEffect } from 'react';
import classNames from 'classnames/bind';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import {
  CommandBarButton,
  getTheme,
  IOverflowSetItemProps,
  OverflowSet,
  Stack,
} from '@fluentui/react';
import { SpinnerContext } from '../Spinner/SpinnerProvider';
import { MapContext } from '../Map/Map';
import { getLayerById } from '../../util/util';
import { OptionsContext } from '../Options/OptionsProvider';

// import FullScreenButtonControl fro../FullScreenButtonControl/FullScreenButtonControlrol';
import MyLocationButtonControl from '../MyLocationButtonControl/MyLocationButtonControl';
import DownloadButtonControl from '../DownloadButtonControl/DownloadButtonControl';
import ZoomToExtentButtonControl from '../ZoomToExtentButtonControl/ZoomToExtentButtonControl';
// import GetLinkButtonControl from '../GetLinkButtonControl/GetLinkButtonControl';
import PdfExportButtonControl from '../PdfExportButtonControl/PdfExportButtonControl';

import controls, { zoomControl } from './controls';

import STYLES from './MapControls.module.scss';
const theme = getTheme();

const c = classNames.bind(STYLES);
const noOp = () => undefined;

const onRenderItemStyles = {
  root: { padding: '10px' },
};
const onRenderOverflowButtonStyles = {
  root: { padding: '10px' },
  menuIcon: { fontSize: '16px' },
};

const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
  return (
    <CommandBarButton
      role="menuitem"
      aria-label={item.name}
      styles={onRenderItemStyles}
      iconProps={{ iconName: item.icon }}
      onClick={item.onClick}
    />
  );
};

const onRenderOverflowButton = (
  overflowItems: any[] | undefined
): JSX.Element => {
  return (
    <CommandBarButton
      role="menuitem"
      title="More items"
      styles={onRenderOverflowButtonStyles}
      menuIconProps={{ iconName: 'More' }}
      menuProps={{ items: overflowItems! }}
    />
  );
};

export interface MapControlsProps {
  map: Map;
  showSpinner: boolean;
}
export const MapControls: React.FunctionComponent<MapControlsProps> = ({
  map,
  showSpinner,
}) => {
  // const zoomContainerRef = React.createRef(null);

  useEffect(() => {
    // if (zoomContainerRef.current) {
    // zoomControl.setTarget(zoomContainerRef.current);
    // }
    // controls.forEach((control) => map.addControl(control));
    return () => {
      // controls.forEach((control) => map.removeControl(control));
    };
  });

  //  const tooltipToggle = (i) => {
  //     this.setState(({ openTooltipIndex }) => ({
  //       openTooltipIndex: i === openTooltipIndex ? -1 : i,
  //     }));
  //   };

  // render() {

  // const { showSpinner, map } = this.props;
  const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');
  // const buttonProps = {
  //   map,
  //   className: c('MapControls__button-control'),
  // };
  return (
    <div className={STYLES.MapControls}>
      <Stack
        tokens={{
          childrenGap: 0,
        }}
      >
        {/* <OverflowSet
          aria-label="Vertical Example"
          role="menubar"
          vertical
          styles={{
            root: {
              borderRadius: theme.effects.roundedCorner6,
              color: 'red',
              background: 'blue',
            },
          }}
          items={[
            {
              key: 'item1',
              icon: 'Add',
              name: 'Link 1',
              ariaLabel: 'New. Use left and right arrow keys to navigate',
              onClick: noOp,
            },
            {
              key: 'item2',
              icon: 'CalculatorSubtract',
              name: 'Link 2',
              onClick: noOp,
            },
          ]}
          onRenderOverflowButton={onRenderOverflowButton}
          onRenderItem={onRenderItem}
        />
        <OverflowSet
          aria-label="Vertical Example"
          role="menubar"
          vertical
          items={[
            {
              key: 'item3',
              icon: 'ZoomToFit',
              name: 'Link 3',
              onClick: noOp,
            },
            {
              key: 'item4',
              icon: 'PDF',
              name: 'Link 3',
              onClick: noOp,
            },
            {
              key: 'item5',
              icon: 'Download',
              name: 'Link 3',
              onClick: noOp,
            },
            {
              key: 'item6',
              icon: 'Location',
              name: 'Link 3',
              onClick: noOp,
            },
          ]}
          onRenderOverflowButton={onRenderOverflowButton}
          onRenderItem={onRenderItem}
        /> */}
        <ZoomToExtentButtonControl tooltip="Fit Extent" map={map} />
        <PdfExportButtonControl tooltip="Export to PDF" map={map} />
      </Stack>
      {/* <div ref={this.zoomContainerRef} />
      {/* <FullScreenButtonControl
       tooltip="Toggle full-screen"
       {...buttonProps}
     /> */}

      {/* <DownloadButtonControl
        tooltip="Download Route and Maps"
        vectorLayer={gpxVectorLayer}
        showSpinner={showSpinner}
        {...buttonProps}
      /> */}
      {/* <GetLinkButtonControl tooltip="Get Shareable Link" {...buttonProps} /> */}
      {/* <MyLocationButtonControl
        tooltip="Show My Location"
        showSpinner={showSpinner}
        {...buttonProps}
      /> */}
      {/* <ControlIcon target={rotateNorthButton}>
       <MdRotateLeft />
     </ControlIcon> */}
    </div>
  );
};

MapControls.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const MapControlsContainer: React.FunctionComponent<MapControlsProps> = (
  props
) => (
  <OptionsContext.Consumer>
    {({ values }) => {
      const { showControls } = values;
      return (
        <MapContext.Consumer>
          {({ map }) => (
            <SpinnerContext.Consumer>
              {({ toggle: showSpinner }) =>
                showControls ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <MapControls showSpinner={showSpinner} map={map} {...props} />
                ) : null
              }
            </SpinnerContext.Consumer>
          )}
        </MapContext.Consumer>
      );
    }}
  </OptionsContext.Consumer>
);

export default MapControlsContainer;
