import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import {
  MdFullscreen,
  MdRotateLeft,
  MdMyLocation,
  MdLink,
} from 'react-icons/md';
import { FaFilePdf } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { Tooltip } from 'reactstrap';
import { SpinnerContext } from '../Spinner/SpinnerProvider';
import { MapContext } from '../Map/Map';
import { getLayerById } from '../../util/util';
import { OptionsContext } from '../Options/OptionsProvider';

import {
  zoomControl,
  zoomToExtentControl,
  rotateNorthControl,
  fullScreenControl,
  attributionControl,
  scaleLineControl,
  pdfExportControl,
  downloadControl,
  myLocationControl,
  linkControl,
  allControls,
} from './controls';

import STYLES from './MapControls.module.scss';

const { firstChild: zoomToExtentButton } = zoomToExtentControl.element;
const { firstChild: rotateNorthButton } = rotateNorthControl.element;
const { firstChild: pdfExportButton } = pdfExportControl.element;
const { firstChild: downloadButton } = downloadControl.element;
const { firstChild: myLocationButton } = myLocationControl.element;
const { firstChild: fullScreenButton } = fullScreenControl.element;
const { firstChild: linkButton } = linkControl.element;

const controlButtons = [
  zoomToExtentButton,
  rotateNorthButton,
  fullScreenButton,
  pdfExportButton,
  downloadButton,
  myLocationButton,
  linkButton,
];

const tooltipTitles = controlButtons.map(button =>
  button.getAttribute('title')
);

const ControlIcon = ({ children, target }) =>
  ReactDOM.createPortal(children, target);

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

    [pdfExportControl, downloadControl, myLocationControl].forEach(control =>
      control.setLoadingFunc(showSpinner)
    );

    downloadControl.setVectorLayer(gpxVectorLayer);

    [
      zoomControl,
      zoomToExtentControl,
      rotateNorthControl,
      fullScreenControl,
      pdfExportControl,
      downloadControl,
      linkControl,
      myLocationControl,
    ].forEach(control => {
      control.setTarget(target);
      map.addControl(control);
    });

    map.addControl(attributionControl);
    map.addControl(scaleLineControl);
  }

  componentWillUnmount() {
    const { map } = this.props;
    allControls.forEach(control => {
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
        {controlButtons.map((button, i) => (
          <Tooltip
            key={tooltipTitles[i]}
            placement="right"
            isOpen={i === openTooltipIndex}
            target={button}
            toggle={() => this.tooltipToggle(i)}
            delay={0}
          >
            {tooltipTitles[i]}
          </Tooltip>
        ))}
        <ControlIcon target={zoomToExtentButton}>
          <MdFullscreen />
        </ControlIcon>
        <ControlIcon target={rotateNorthButton}>
          <MdRotateLeft />
        </ControlIcon>
        <ControlIcon target={pdfExportButton}>
          <FaFilePdf />
        </ControlIcon>
        <ControlIcon target={downloadButton}>
          <IoMdDownload />
        </ControlIcon>
        <ControlIcon target={myLocationButton}>
          <MdMyLocation />
        </ControlIcon>
        <ControlIcon target={linkButton}>
          <MdLink />
        </ControlIcon>
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
