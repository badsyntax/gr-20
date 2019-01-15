import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import { MdFullscreen, MdRotateLeft, MdMyLocation } from 'react-icons/md';
import { FaFilePdf } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { Tooltip } from 'reactstrap';
import { SpinnerContext } from '../Spinner/SpinnerProvider';
import { MapContext } from '../Map/Map';
import { getLayerById } from '../../util/util';
import { OptionsContext } from '../Options/OptionsProvider';

import {
  zoom,
  zoomToExtent,
  rotateNorth,
  fullScreen,
  attribution,
  scaleLine,
  pdfExport,
  download,
  myLocation,
} from './controls';

import STYLES from './MapControls.module.scss';

const { firstChild: zoomToExtentButton } = zoomToExtent.element;
const { firstChild: rotateNorthButton } = rotateNorth.element;
const { firstChild: pdfExportButton } = pdfExport.element;
const { firstChild: downloadButton } = download.element;
const { firstChild: myLocationButton } = myLocation.element;

const tooltips = [
  // {
  //   target: zoomToExtentLabel,
  //   label: 'Zoom to Route',
  // },
  // {
  //   target: rotateNorthLabel,
  //   label: 'Rotate North',
  // },
  // {
  //   target: fullScreenLabel,
  //   label: 'Fullscreen',
  // },
  // {
  //   target: pdfExportLabel,
  //   label: 'Export to PDF',
  // },
  // {
  //   target: downloadButton,
  //   label: 'Download Route and Maps',
  // },
  {
    target: myLocationButton,
    label: 'Show My Location',
  },
];

const IconLabel = ({ children, label }) =>
  ReactDOM.createPortal(children, label);

class MapControls extends Component {
  state = {
    openTooltipIndex: -1,
  };

  constructor(props) {
    super(props);
    this.controlGroupRef = React.createRef();
  }

  componentDidMount() {
    const { map, showSpinner } = this.props;
    const { current: target } = this.controlGroupRef;

    const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');

    // pdfExport.setLoadingFunc(showSpinner);
    download.setLoadingFunc(showSpinner);
    download.setVectorLayer(gpxVectorLayer);
    myLocation.setLoadingFunc(showSpinner);

    [
      zoom,
      zoomToExtent,
      rotateNorth,
      fullScreen,
      pdfExport,
      download,
      myLocation,
    ].forEach(control => {
      control.setTarget(target);
      map.addControl(control);
    });

    map.addControl(attribution);
    map.addControl(scaleLine);
  }

  componentWillUnmount() {
    const { map } = this.props;
    [
      zoom,
      zoomToExtent,
      rotateNorth,
      fullScreen,
      attribution,
      scaleLine,
      download,
      myLocation,
    ].forEach(control => {
      map.removeControl(control);
    });
  }

  tooltipToggle = i => {
    this.setState(({ openTooltipIndex }) => ({
      openTooltipIndex: i === openTooltipIndex ? -1 : i,
    }));
  };

  render() {
    const { openTooltipIndex } = this.state;

    return (
      <div ref={this.controlGroupRef} className={STYLES.MapControls}>
        {tooltips.map((tooltip, i) => (
          <Tooltip
            key={tooltip.label}
            placement="right"
            isOpen={i === openTooltipIndex}
            target={tooltip.target}
            toggle={() => this.tooltipToggle(i)}
            delay={0}
          >
            {tooltip.label}
          </Tooltip>
        ))}
        <IconLabel label={zoomToExtentButton}>
          <MdFullscreen />
        </IconLabel>
        <IconLabel label={rotateNorthButton}>
          <MdRotateLeft />
        </IconLabel>
        <IconLabel label={pdfExportButton}>
          <FaFilePdf />
        </IconLabel>
        <IconLabel label={downloadButton}>
          <IoMdDownload />
        </IconLabel>
        <IconLabel label={myLocationButton}>
          <MdMyLocation />
        </IconLabel>
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
