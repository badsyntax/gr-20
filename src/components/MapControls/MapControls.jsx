/* eslint-disable func-names */
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Map from "ol/Map";
import PropTypes from "prop-types";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import Zoom from "ol/control/Zoom";
import ZoomToExtent from "ol/control/ZoomToExtent";
import ScaleLine from "ol/control/ScaleLine";
import { MdFullscreen, MdZoomOutMap, MdRotateLeft } from "react-icons/md";
import RotateNorthControl from "../RotateNorthControl/RotateNorthControl";
import STYLES from "./MapControls.module.scss";

const zoom = new Zoom();

const zoomToExtentLabel = document.createElement("span");

const attribution = new Attribution({
  collapsible: true
});

const fullScreenLabel = document.createElement("span");

const fullScreen = new FullScreen({
  label: fullScreenLabel
});

const zoomToExtent = new ZoomToExtent({
  label: zoomToExtentLabel,
  extent: [
    978823.488305482,
    5121096.608475749,
    1039463.1111227559,
    5245134.752643153
  ]
});

const scaleLine = new ScaleLine({
  units: "metric",
  minWidth: 100
});

const rotateNorthLabel = document.createElement("span");

const rotateNorth = new RotateNorthControl({
  label: rotateNorthLabel
});

const IconLabel = props => ReactDOM.createPortal(props.children, props.label);

class MapControls extends Component {
  constructor(props) {
    super(props);
    this.controlGroupRef = React.createRef();
  }

  componentDidMount() {
    const { map } = this.props;
    const { current: target } = this.controlGroupRef;

    [zoom, zoomToExtent, rotateNorth, fullScreen].forEach(control => {
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
      scaleLine
    ].forEach(control => {
      map.removeControl(control);
    });
  }

  render() {
    return (
      <Fragment>
        <IconLabel label={zoomToExtentLabel}>
          <MdZoomOutMap />
        </IconLabel>
        <IconLabel label={rotateNorthLabel}>
          <MdRotateLeft />
        </IconLabel>
        <IconLabel label={fullScreenLabel}>
          <MdFullscreen />
        </IconLabel>
        <div ref={this.controlGroupRef} className={STYLES.MapControls} />
      </Fragment>
    );
  }
}

MapControls.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired
};

export default MapControls;
