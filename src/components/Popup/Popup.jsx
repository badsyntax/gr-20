import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { Vector as VectorLayer } from "ol/layer";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import { MdHome, MdZoomIn, MdClose } from "react-icons/md";
import { getElevation, getHDMS } from "../../util/util";

import ClosePopupControl from "./ClosePopupControl";
import ZoomInControl from "./ZoomInControl";
import STYLES from "./Popup.module.scss";

const closeButtonLabel = document.createElement("span");
const closeButton = new ClosePopupControl({
  label: closeButtonLabel
});

const zoomInButtonLabel = document.createElement("span");
const zoomInButton = new ZoomInControl({
  label: zoomInButtonLabel
});

const IconLabel = ({ children, label }) =>
  ReactDOM.createPortal(children, label);

class Popup extends Component {
  state = {
    isOpen: false,
    elevation: null,
    hdms: null,
    name: null,
    lonLat: []
  };

  constructor(props) {
    super(props);
    this.closeButtonRef = React.createRef();
    this.zoomInButtonRef = React.createRef();
  }

  componentWillMount() {
    this.container = document.createElement("div");
  }

  componentDidMount() {
    const { map } = this.props;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: true,
      stopEvent: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    map.addOverlay(this.overlay);
    map.on("click", this.onMapClick);

    map.addControl(closeButton);
    map.addControl(zoomInButton);

    closeButton.setOnClick(this.onCloseButtonClick);
    zoomInButton.setOnClick(this.onZoomInButtonClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { map } = this.props;
    if (isOpen && prevState.isOpen !== isOpen) {
      closeButton.setTarget(this.closeButtonRef.current);
      zoomInButton.setTarget(this.zoomInButtonRef.current);
      map.removeControl(closeButton);
      map.addControl(closeButton);
      // map.removeControl(zoomInButton);
      // map.addControl(zoomInButton);
    }
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
        // const multiLine = getMultiLineStringFeature(
        //   gpxVectorLayer.getSource().getFeatures()
        // );
        // const closestPoint = multiLine
        //   .getGeometry()
        //   .getClosestPoint(evt.coordinate);
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

  onCloseButtonClick = () => {
    this.setState({
      isOpen: false
    });
  };

  onZoomInButtonClick = () => {
    alert("zoom in");
  };

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
        className={STYLES.Popup}
      >
        <PopoverHeader>
          <IconLabel label={closeButtonLabel}>
            <MdClose />
          </IconLabel>
          <span ref={this.closeButtonRef} />
          <MdHome size={20} style={{ verticalAlign: "top" }} /> {name}
        </PopoverHeader>
        <PopoverBody>
          <div>Elevation: {elevation}m</div>
          <div>Longitude: {lon}</div>
          <div>Latitdue: {lat}</div>
          <div>Coordinates: {hdms}</div>
          <IconLabel label={zoomInButtonLabel}>
            <MdZoomIn />
          </IconLabel>
          <span ref={this.zoomInButtonRef} />
        </PopoverBody>
      </Popover>
    );
  }
}

Popup.propTypes = {
  gpxVectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,
  map: PropTypes.instanceOf(Map).isRequired
};

export default Popup;
