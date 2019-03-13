import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
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

const c = classNames.bind(STYLES);

class MapControls extends Component {
  constructor(props) {
    super(props);
    this.zoomContainerRef = React.createRef();
  }

  componentDidMount() {
    const { map } = this.props;
    zoomControl.setTarget(this.zoomContainerRef.current);
    controls.forEach(control => map.addControl(control));
  }

  componentWillUnmount() {
    const { map } = this.props;
    controls.forEach(control => map.removeControl(control));
  }

  tooltipToggle = i => {
    this.setState(({ openTooltipIndex }) => ({
      openTooltipIndex: i === openTooltipIndex ? -1 : i,
    }));
  };

  render() {
    const { showSpinner, map } = this.props;
    const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');
    const buttonProps = {
      map,
      className: c('MapControls__button-control'),
    };
    return (
      <div className={STYLES.MapControls}>
        <div ref={this.zoomContainerRef} />
        <ZoomToExtentButtonControl tooltip="Fit Extent" {...buttonProps} />
        {/* <FullScreenButtonControl
          tooltip="Toggle full-screen"
          {...buttonProps}
        /> */}
        <PdfExportButtonControl
          tooltip="Export to PDF"
          showSpinner={showSpinner}
          {...buttonProps}
        />
        <DownloadButtonControl
          tooltip="Download Route and Maps"
          vectorLayer={gpxVectorLayer}
          showSpinner={showSpinner}
          {...buttonProps}
        />
        {/* <GetLinkButtonControl tooltip="Get Shareable Link" {...buttonProps} /> */}
        <MyLocationButtonControl
          tooltip="Show My Location"
          showSpinner={showSpinner}
          {...buttonProps}
        />
        {/* <ControlIcon target={rotateNorthButton}>
          <MdRotateLeft />
        </ControlIcon> */}
      </div>
    );
  }
}

MapControls.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  showSpinner: PropTypes.func.isRequired,
};

export default props => (
  <OptionsContext.Consumer>
    {({ values }) => {
      const { showControls } = values;
      return (
        <MapContext.Consumer>
          {({ map }) => (
            <SpinnerContext.Consumer>
              {({ toggle: showSpinner }) =>
                showControls ? (
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
