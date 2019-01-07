/* eslint-disable func-names */
import { Component } from "react";
import Map from "ol/Map";
import PropTypes from "prop-types";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import ZoomToExtent from "ol/control/ZoomToExtent";
import ScaleLine from "ol/control/ScaleLine";
import Control from "ol/control/Control";
import "./MapControls.scss";

function RotateNorthControl(optOptions) {
  const options = optOptions || {};

  const button = document.createElement("button");
  button.innerHTML = "N";

  const element = document.createElement("div");
  element.className = "rotate-north ol-unselectable ol-control";
  element.appendChild(button);

  Control.call(this, {
    element,
    target: options.target
  });

  button.addEventListener("click", this.handleRotateNorth.bind(this), false);
}

// eslint-disable-next-line no-proto
if (Control) RotateNorthControl.__proto__ = Control;
RotateNorthControl.prototype = Object.create(Control && Control.prototype);
RotateNorthControl.prototype.constructor = RotateNorthControl;

RotateNorthControl.prototype.handleRotateNorth = function handleRotateNorth() {
  this.getMap()
    .getView()
    .setRotation(0);
};

const attribution = new Attribution({
  collapsible: true
});

const fullScreen = new FullScreen();

const zoomToExtent = new ZoomToExtent({
  label: "H",
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

// const rotateNorthControl = new RotateNorthControl();

class MapControls extends Component {
  componentDidMount() {
    const { map } = this.props;
    map.addControl(attribution);
    map.addControl(fullScreen);
    map.addControl(zoomToExtent);
    map.addControl(scaleLine);
    // map.addControl(rotateNorthControl);
  }

  render() {
    return null;
  }
}

MapControls.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired
};

export default MapControls;
