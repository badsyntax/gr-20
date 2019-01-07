import React, { Component } from "react";
import PropTypes from "prop-types";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import "./Popup.scss";

const getElevation = (feature, coordinate) => {
  const geometry = feature.getGeometry();
  const point = geometry.getClosestPoint(coordinate);
  const elevation = Math.round(point[2]);
  return elevation;
};

const getHDMS = coordinate => {
  const lonLat = toLonLat(coordinate);
  const hdms = toStringHDMS(lonLat);
  return hdms;
};

class Popup extends Component {
  constructor(props) {
    super(props);
    this.overlay = null;
    this.state = {
      isOpen: false,
      elevation: null,
      hdms: null,
      name: null,
      lonLat: []
    };
  }

  componentWillMount() {
    this.container = document.createElement("div");
  }

  componentDidMount() {
    const { map } = this.props;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    map.addOverlay(this.overlay);
    map.on("click", this.onMapClick);
  }

  componentWillUnmount() {
    const { map } = this.props;
    this.container.parentNode.removeChild(this.container);
    map.un("click", this.onMapClick);
  }

  onMapClick = evt => {
    const { map } = this.props;
    const features = map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length) {
      const feature = features[0];
      let coordinates;
      if (feature.getGeometry().getType() === "MultiLineString") {
        coordinates = evt.coordinate;
      } else {
        // eg Point
        coordinates = feature.getGeometry().getCoordinates();
      }
      const lonLat = toLonLat(coordinates);
      const elevation = getElevation(feature, coordinates);
      const hdms = getHDMS(coordinates);
      const pointProps = feature.getProperties();
      this.setState(
        {
          isOpen: true,
          hdms,
          elevation,
          lonLat,
          ...pointProps
        },
        () => this.overlay.setPosition(coordinates)
      );
    } else {
      this.setState({
        isOpen: false
      });
    }
  };

  toggle = () => {};

  render() {
    const { elevation, hdms, name, isOpen, lonLat } = this.state;
    const lon = (lonLat[0] || 0).toFixed(2);
    const lat = (lonLat[1] || 0).toFixed(2);
    return (
      <Popover
        placement="top"
        isOpen={isOpen}
        target={this.container}
        container={this.container}
        toggle={this.toggle}
      >
        <PopoverHeader>{name}</PopoverHeader>
        <PopoverBody>
          <div>Elevation: {elevation}m</div>
          <div>Longitude: {lon}</div>
          <div>Latitdue: {lat}</div>
          <div>Coordinates: {hdms}</div>
        </PopoverBody>
      </Popover>
    );
  }
}

Popup.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired
};

export default Popup;
