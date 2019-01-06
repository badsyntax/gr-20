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
      name: null
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
    this.container.parentNode.removeChild(this.container);
  }

  onMapClick = evt => {
    const { map } = this.props;
    const features = map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length) {
      const { coordinate } = evt;
      const feature = features[0];
      const elevation = getElevation(feature, coordinate);
      const hdms = getHDMS(coordinate);
      const pointProps = feature.getProperties();
      this.setState(
        {
          isOpen: true,
          hdms,
          elevation,
          ...pointProps
        },
        () => this.overlay.setPosition(coordinate)
      );
    } else {
      this.setState({
        isOpen: false
      });
    }
  };

  toggle = () => {};

  render() {
    const { elevation, hdms, name, isOpen } = this.state;
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
          <div>
            <code>{hdms}</code>
          </div>
        </PopoverBody>
      </Popover>
    );
  }
}

Popup.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired
};

export default Popup;
