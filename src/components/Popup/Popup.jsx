import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { toLonLat, fromLonLat } from 'ol/proj';
import { easeOut } from 'ol/easing';
import { MdHome } from 'react-icons/md';
import LineString from 'ol/geom/LineString';

import CloseButtonControl from './CloseButtonControl';
import ZoomInButtonControl from './ZoomInButtonControl';
import PrevPointButtonControl from './PrevPointButtonControl';
import NextPointButtonControl from './NextPointButtonControl';

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
  };

  containerRef = React.createRef();

  componentDidMount() {
    const { map } = this.props;

    this.overlay = new Overlay({
      element: this.containerRef.current,
      autoPan: false,
      stopEvent: false,
    });

    map.addOverlay(this.overlay);
    map.on('click', this.onMapClick);
    this.setSortedPoints();
  }

  componentDidUpdate(prevProps, prevState) {
    const { gpxUrl } = this.props;
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSortedPoints();
    }
  }

  componentWillUnmount() {
    const { map } = this.props;
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
    } else if (evt.originalEvent.target.nodeName.toLowerCase() === 'canvas') {
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

  onZoomInButotnClick = () => {
    const { lonLat } = this.state;
    const { map } = this.props;
    map.getView().animate({
      center: fromLonLat(lonLat),
      zoom: 18,
      duration: 1000,
      easing: easeOut,
    });
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
    } = this.state;
    const lon = (lonLat[0] || 0).toFixed(6);
    const lat = (lonLat[1] || 0).toFixed(6);
    const sortedPointIndex = sortedPointsInMultiline.indexOf(sortedPoint);
    return (
      <div ref={this.containerRef}>
        <Popover
          placement="top"
          isOpen={isOpen}
          target={() => this.containerRef.current}
          container={() => this.containerRef.current}
          toggle={this.toggle}
          className={STYLES.Popup}
        >
          <PopoverHeader>
            <CloseButtonControl
              onClick={this.onCloseButtonClick}
              tooltip="Close"
            />
            <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
          </PopoverHeader>
          <PopoverBody>
            <div>Elevation: {elevation}m</div>
            <div>Longitude: {lon}</div>
            <div>Latitdue: {lat}</div>
            <div>Coordinates: {hdms}</div>
            {distanceInKm && (
              <div>Distance to next point: {distanceInKm}km</div>
            )}
            <div style={{ paddingTop: '0.5rem' }}>
              <ZoomInButtonControl
                onClick={this.onZoomInButotnClick}
                tooltip="Zoom to Point"
              />
              {sortedPointIndex > 0 && (
                <PrevPointButtonControl
                  onClick={this.onPrevPointButtonClick}
                  tooltip="Previous Point"
                />
              )}
              {sortedPointIndex < sortedPointsInMultiline.length - 1 && (
                <NextPointButtonControl
                  onClick={this.onNextPointButtonClick}
                  tooltip="Next Point"
                />
              )}
            </div>
          </PopoverBody>
        </Popover>
      </div>
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
