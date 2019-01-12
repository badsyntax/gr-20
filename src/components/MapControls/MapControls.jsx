import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import { MdFullscreen, MdZoomOutMap, MdRotateLeft } from 'react-icons/md';
import { FaFilePdf } from 'react-icons/fa';
import { Tooltip } from 'reactstrap';
import { SpinnerContext } from '../Spinner/SpinnerProvider';
import {
  zoom,
  zoomToExtent,
  zoomToExtentLabel,
  rotateNorth,
  rotateNorthLabel,
  fullScreen,
  fullScreenLabel,
  attribution,
  scaleLine,
  pdfExportLabel,
  pdfExport,
} from './controls';

import STYLES from './MapControls.module.scss';

const tooltips = [
  {
    target: zoomToExtentLabel,
    label: 'Zoom to Route',
  },
  {
    target: rotateNorthLabel,
    label: 'Rotate North',
  },
  {
    target: fullScreenLabel,
    label: 'Fullscreen',
  },
  {
    target: pdfExportLabel,
    label: 'Export to PDF',
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

    pdfExport.setLoadingFunc(showSpinner);
    [zoom, zoomToExtent, rotateNorth, fullScreen, pdfExport].forEach(
      control => {
        control.setTarget(target);
        map.addControl(control);
      }
    );

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
        <IconLabel label={zoomToExtentLabel}>
          <MdZoomOutMap />
        </IconLabel>
        <IconLabel label={rotateNorthLabel}>
          <MdRotateLeft />
        </IconLabel>
        <IconLabel label={fullScreenLabel}>
          <MdFullscreen />
        </IconLabel>
        <IconLabel label={pdfExportLabel}>
          <FaFilePdf />
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
  <SpinnerContext.Consumer>
    {({ toggle: showSpinner }) => (
      <MapControls showSpinner={showSpinner} {...props} />
    )}
  </SpinnerContext.Consumer>
);
