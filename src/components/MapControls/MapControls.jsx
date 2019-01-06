import { Component } from "react";
import Map from "ol/Map";
import PropTypes from "prop-types";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import ZoomToExtent from "ol/control/ZoomToExtent";
import ScaleLine from "ol/control/ScaleLine";
import "./MapControls.scss";

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

class MapControls extends Component {
  componentDidMount() {
    const { map } = this.props;
    map.addControl(attribution);
    map.addControl(fullScreen);
    map.addControl(zoomToExtent);
    map.addControl(scaleLine);
  }

  render() {
    return null;
  }
}

MapControls.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired
};

export default MapControls;
