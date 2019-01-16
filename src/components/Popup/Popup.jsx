import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { toLonLat, fromLonLat } from 'ol/proj';
import { MdHome, MdZoomIn, MdClose } from 'react-icons/md';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import LineString from 'ol/geom/LineString';
import { easeOut } from 'ol/easing';

import {
  getElevation,
  getHDMS,
  getMultiLineStringFeature,
  getSortedPoints,
  getLayerById,
} from '../../util/util';

import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';

import STYLES from './Popup.module.scss';

import {
  closeControl,
  zoomInControl,
  prevPointControl,
  nextPointControl,
} from './controls';

const { firstChild: closeControlButton } = closeControl.element;
const { firstChild: zoomInControlButton } = zoomInControl.element;
const { firstChild: prevPointControlButton } = prevPointControl.element;
const { firstChild: nextPointControlButton } = nextPointControl.element;

const controlButtons = [
  closeControlButton,
  zoomInControlButton,
  prevPointControlButton,
  nextPointControlButton,
];

const tooltipTitles = controlButtons.map(button =>
  button.getAttribute('title')
);

const ControlIcon = ({ children, target }) =>
  ReactDOM.createPortal(children, target);

class Popup extends Component {
  state = {
    isOpen: false,
    elevation: null,
    hdms: null,
    name: null,
    lonLat: [],
    sortedPointsInMultiline: [],
    sortedPoint: null,
    distanceInKm: null,
    openTooltipIndex: -1,
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
    const { map } = this.props;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: false,
      stopEvent: true,
    });

    map.addOverlay(this.overlay);
    map.on('click', this.onMapClick);

    closeControl.setOnClick(this.onCloseButtonClick);
    zoomInControl.setOnClick(this.onZoomInButtonClick);
    prevPointControl.setOnClick(this.onPrevPointButtonClick);
    nextPointControl.setOnClick(this.onNextPointButtonClick);

    this.setSortedPoints();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { map, gpxUrl } = this.props;
    if (isOpen && prevState.isOpen !== isOpen) {
      closeControl.setTarget(this.closeButtonRef.current);
      zoomInControl.setTarget(this.zoomInButtonRef.current);
      nextPointControl.setTarget(this.nextButtonRef.current);
      prevPointControl.setTarget(this.prevButtonRef.current);
      [closeControl, zoomInControl, nextPointControl, prevPointControl].forEach(
        control => map.addControl(control)
      );
    }
    if (!isOpen && prevState.isOpen !== isOpen) {
      [closeControl, zoomInControl, nextPointControl, prevPointControl].forEach(
        control => map.removeControl(control)
      );
    }
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSortedPoints();
    }
  }

  componentWillUnmount() {
    const { map } = this.props;
    this.container.parentNode.removeChild(this.container);
    map.un('click', this.onMapClick);
  }

  setSortedPoints() {
    const { map } = this.props;
    const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');
    gpxVectorLayer.getSource().once('change', () => {
      const sortedPointsInMultiline = getSortedPoints(gpxVectorLayer);
      this.setState({
        sortedPointsInMultiline,
      });
    });
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

  tooltipToggle = i => {
    this.setState(({ openTooltipIndex }) => ({
      openTooltipIndex: i === openTooltipIndex ? -1 : i,
    }));
  };

  openPopup(evt, feature, setCenter = false) {
    const { sortedPointsInMultiline } = this.state;
    const { map } = this.props;

    const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');

    let coordinates = null;
    let distanceInKm = null;
    let sortedPoint = null;

    if (feature.getGeometry().getType() === 'MultiLineString') {
      coordinates = evt.coordinate;
    } else {
      // eg Point
      coordinates = feature.getGeometry().getCoordinates();

      const multiLine = getMultiLineStringFeature(
        gpxVectorLayer.getSource().getFeatures()
      );

      const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];

      sortedPoint = sortedPointsInMultiline.find(
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
        distanceInKm = (distance / 1000).toFixed(2);
      }
    }

    const lonLat = toLonLat(coordinates);
    const elevation = getElevation(feature, coordinates);
    const hdms = getHDMS(coordinates);
    const pointProps = feature.getProperties();

    this.setState(
      {
        hdms,
        elevation,
        lonLat,
        distanceInKm,
        sortedPoint,
        isOpen: true,
        ...pointProps,
      },
      () => {
        if (setCenter) {
          map.getView().setCenter(coordinates);
        }
        this.overlay.setPosition(coordinates);
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
      openTooltipIndex,
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
        {controlButtons.map((button, i) => (
          <Tooltip
            key={tooltipTitles[i]}
            placement="bottom"
            isOpen={i === openTooltipIndex}
            target={button}
            toggle={() => this.tooltipToggle(i)}
            delay={0}
          >
            {tooltipTitles[i]}
          </Tooltip>
        ))}
        <PopoverHeader>
          <ControlIcon target={closeControlButton}>
            <MdClose />
          </ControlIcon>
          <span ref={this.closeButtonRef} />
          <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
        </PopoverHeader>
        <PopoverBody>
          <div>Elevation: {elevation}m</div>
          <div>Longitude: {lon}</div>
          <div>Latitdue: {lat}</div>
          <div>Coordinates: {hdms}</div>
          {distanceInKm && <div>Distance to next point: {distanceInKm}km</div>}
          <div style={{ paddingTop: '0.5rem' }}>
            <ControlIcon target={zoomInControlButton}>
              <MdZoomIn />
            </ControlIcon>
            <span ref={this.zoomInButtonRef} />
            {sortedPointIndex > 0 && (
              <Fragment>
                <ControlIcon target={prevPointControlButton}>
                  <FaCaretLeft />
                </ControlIcon>
                <span ref={this.prevButtonRef} />
              </Fragment>
            )}
            {sortedPointIndex < sortedPointsInMultiline.length - 1 && (
              <Fragment>
                <ControlIcon target={nextPointControlButton}>
                  <FaCaretRight />
                </ControlIcon>
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
  map: PropTypes.instanceOf(Map).isRequired,
  gpxUrl: PropTypes.string.isRequired,
};

export default props => (
  <OptionsContext.Consumer>
    {({ values }) => {
      const { gpxUrl } = values;
      return (
        <MapContext.Consumer>
          {({ map }) => <Popup map={map} gpxUrl={gpxUrl} {...props} />}
        </MapContext.Consumer>
      );
    }}
  </OptionsContext.Consumer>
);
