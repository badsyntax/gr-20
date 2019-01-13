import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { toLonLat, fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { MdHome, MdZoomIn, MdClose } from 'react-icons/md';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import LineString from 'ol/geom/LineString';
import Control from 'ol/control/Control';
import { easeOut } from 'ol/easing';
import {
  getElevation,
  getHDMS,
  getMultiLineStringFeature,
  getSortedPoints,
} from '../../util/util';

import ClosePopupControl from './ClosePopupControl';
import ZoomInControl from './ZoomInControl';
import STYLES from './Popup.module.scss';

class PrevPointControl extends Control {
  constructor(optOptions) {
    const options = optOptions || {};

    const button = document.createElement('button');
    button.appendChild(options.label);
    button.setAttribute('title', 'Close');

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control';
    element.classList.add(STYLES['Popup__next-button']);
    element.appendChild(button);

    super({
      element,
      target: options.target,
    });

    this._onClick = () => {};
    button.addEventListener('click', this.onClick, false);
  }

  onClick = e => {
    this._onClick(e);
  };

  setOnClick(func) {
    this._onClick = func;
  }
}

class NextPointControl extends Control {
  constructor(optOptions) {
    const options = optOptions || {};

    const button = document.createElement('button');
    button.appendChild(options.label);
    button.setAttribute('title', 'Close');

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control';
    element.classList.add(STYLES['Popup__next-button']);
    element.appendChild(button);

    super({
      element,
      target: options.target,
    });

    this._onClick = () => {};
    button.addEventListener('click', this.onClick, false);
  }

  onClick = e => {
    this._onClick(e);
  };

  setOnClick(func) {
    this._onClick = func;
  }
}

const closeButtonLabel = document.createElement('span');
const closeButton = new ClosePopupControl({
  label: closeButtonLabel,
});

const zoomInButtonLabel = document.createElement('span');
const zoomInButton = new ZoomInControl({
  label: zoomInButtonLabel,
});

const prevPointButtonLabel = document.createElement('span');
const prevPointButton = new NextPointControl({
  label: prevPointButtonLabel,
});

const nextPointButtonLabel = document.createElement('span');
const nextPointButton = new PrevPointControl({
  label: nextPointButtonLabel,
});

const IconLabel = ({ children, label }) =>
  ReactDOM.createPortal(children, label);

class Popup extends Component {
  state = {
    isOpen: false,
    elevation: null,
    hdms: null,
    name: null,
    lonLat: [],
    sortedPointsInMultiline: [],
  };

  constructor(props) {
    super(props);
    this.closeButtonRef = React.createRef();
    this.zoomInButtonRef = React.createRef();
    this.nextButtonRef = React.createRef();
    this.prevButtonRef = React.createRef();
  }

  componentWillMount() {
    this.container = document.createElement('div');
  }

  componentDidMount() {
    const { map, gpxVectorLayer } = this.props;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: false,
      stopEvent: true,
    });

    map.addOverlay(this.overlay);
    map.on('click', this.onMapClick);

    map.addControl(closeButton);
    map.addControl(zoomInButton);
    map.addControl(prevPointButton);
    map.addControl(nextPointButton);

    closeButton.setOnClick(this.onCloseButtonClick);
    zoomInButton.setOnClick(this.onZoomInButtonClick);
    prevPointButton.setOnClick(this.onPrevPointButtonClick);
    nextPointButton.setOnClick(this.onNextPointButtonClick);

    gpxVectorLayer.on('change:source', () => {
      gpxVectorLayer.getSource().once('change', () => {
        const sortedPointsInMultiline = getSortedPoints(gpxVectorLayer);
        this.setState({
          sortedPointsInMultiline,
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen, lonLat } = this.state;
    const { map } = this.props;
    if (
      isOpen &&
      (prevState.isOpen !== isOpen || prevState.lonLat !== lonLat)
    ) {
      closeButton.setTarget(this.closeButtonRef.current);
      zoomInButton.setTarget(this.zoomInButtonRef.current);
      nextPointButton.setTarget(this.nextButtonRef.current);
      prevPointButton.setTarget(this.prevButtonRef.current);
      map.removeControl(closeButton);
      map.addControl(closeButton);
      map.removeControl(zoomInButton);
      map.addControl(zoomInButton);
      map.removeControl(nextPointButton);
      map.addControl(nextPointButton);
      map.removeControl(prevPointButton);
      map.addControl(prevPointButton);
    }
  }

  componentWillUnmount() {
    const { map } = this.props;
    this.container.parentNode.removeChild(this.container);
    map.un('click', this.onMapClick);
  }

  onMapClick = evt => {
    const { map } = this.props;
    const features = map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length) {
      const feature = features[0];
      this.openPopup(evt, feature);
    } else {
      this.setState({
        isOpen: false,
      });
    }
  };

  onCloseButtonClick = () => {
    this.setState({
      isOpen: false,
    });
  };

  onZoomInButtonClick = () => {
    const { lonLat } = this.state;
    const { map } = this.props;
    map.getView().animate({
      center: fromLonLat(lonLat),
      zoom: 18,
      duration: 1000,
      easing: easeOut,
    });
  };

  onNextPointButtonClick = () => {
    const { sortedPointsInMultiline, sortedPoint } = this.state;
    const sortedPointIndex = sortedPointsInMultiline.indexOf(sortedPoint);
    const nextPoint = sortedPointsInMultiline[sortedPointIndex + 1];
    this.openPopup(null, nextPoint.featurePoint, true);
  };

  onPrevPointButtonClick = () => {
    const { sortedPointsInMultiline, sortedPoint } = this.state;
    const sortedPointIndex = sortedPointsInMultiline.indexOf(sortedPoint);
    const prevPoint = sortedPointsInMultiline[sortedPointIndex - 1];
    this.openPopup(null, prevPoint.featurePoint, true);
  };

  openPopup(evt, feature, setCenter = false) {
    const { sortedPointsInMultiline } = this.state;
    const { map, gpxVectorLayer } = this.props;

    let coordinates;
    if (feature.getGeometry().getType() === 'MultiLineString') {
      coordinates = evt.coordinate;
    } else {
      // eg Point
      coordinates = feature.getGeometry().getCoordinates();

      const multiLine = getMultiLineStringFeature(
        gpxVectorLayer.getSource().getFeatures()
      );

      const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];

      // const closestPointInMultiLine = multiLine
      //   .getGeometry()
      //   .getClosestPoint(coordinates);

      // const closestPointIndex = multiLineCoords.findIndex(
      //   coord =>
      //     new LineString([coord, closestPointInMultiLine]).getLength() < 30
      // );

      // const sortedPoint = sortedPointsInMultiline.find((point =>
      //   console.log(
      //     new LineString([
      //       closestPointInMultiLine,
      //       point.closestPointInMultiLine,
      //     ]).getLength()
      //   )
      // );

      // console.log('closestPointInMultiLine', closestPointInMultiLine);

      const sortedPoint = sortedPointsInMultiline.find(
        ({ featurePoint }) => featurePoint === feature
      );
      const sortedPointIndex = sortedPointsInMultiline.indexOf(sortedPoint);
      const nextPoint = sortedPointsInMultiline[sortedPointIndex + 1];

      if (sortedPoint && nextPoint) {
        const coordsBetweenPoints = multiLineCoords.slice(
          sortedPoint.index,
          nextPoint.index
        );

        const distance = coordsBetweenPoints.reduce(
          (accumulator, currentValue, i) => {
            const index = i + sortedPoint.index;
            const pointDistance =
              i === coordsBetweenPoints.length - 1
                ? 0
                : new LineString([
                    currentValue,
                    multiLineCoords[index + 1],
                  ]).getLength();
            return accumulator + pointDistance;
          },
          0
        );

        const distanceInKm = (distance / 1000).toFixed(2);

        this.setState({
          distanceInKm,
          sortedPoint,
        });
      } else {
        this.setState({
          sortedPoint,
        });
      }
    }

    const lonLat = toLonLat(coordinates);
    const elevation = getElevation(feature, coordinates);
    const hdms = getHDMS(coordinates);
    const pointProps = feature.getProperties();
    this.setState(
      {
        isOpen: false,
        hdms,
        elevation,
        lonLat,
        ...pointProps,
      },
      () => {
        if (setCenter) {
          map.getView().setCenter(coordinates);
        }
        this.overlay.setPosition(coordinates);
        this.setState({
          isOpen: true,
        });
      }
    );
  }

  render() {
    const {
      elevation,
      hdms,
      name,
      isOpen,
      lonLat,
      distanceInKm,
      sortedPointsInMultiline,
      sortedPoint,
    } = this.state;
    const lon = (lonLat[0] || 0).toFixed(5);
    const lat = (lonLat[1] || 0).toFixed(5);
    const sortedPointIndex = sortedPointsInMultiline.indexOf(sortedPoint);
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
          <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
        </PopoverHeader>
        <PopoverBody>
          <div>Elevation: {elevation}m</div>
          <div>Longitude: {lon}</div>
          <div>Latitdue: {lat}</div>
          <div>Coordinates: {hdms}</div>
          <div>Distance to next point: {distanceInKm}km</div>
          <div style={{ paddingTop: '0.5rem' }}>
            <IconLabel label={zoomInButtonLabel}>
              <MdZoomIn />
            </IconLabel>
            <span ref={this.zoomInButtonRef} />
            {sortedPointIndex > 0 && (
              <Fragment>
                <IconLabel label={prevPointButtonLabel}>
                  <FaCaretLeft />
                </IconLabel>
                <span ref={this.prevButtonRef} />
              </Fragment>
            )}
            {sortedPointIndex < sortedPointsInMultiline.length - 1 && (
              <Fragment>
                <IconLabel label={nextPointButtonLabel}>
                  <FaCaretRight />
                </IconLabel>
                <span ref={this.nextButtonRef} />
              </Fragment>
            )}
          </div>
        </PopoverBody>
      </Popover>
    );
  }
}

Popup.propTypes = {
  gpxVectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
};

export default Popup;
