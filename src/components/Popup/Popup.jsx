import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { easeOut } from 'ol/easing';
import { MdHome } from 'react-icons/md';

import CloseButtonControl from './CloseButtonControl';
import ZoomInButtonControl from './ZoomInButtonControl';
import PrevPointButtonControl from './PrevPointButtonControl';
import NextPointButtonControl from './NextPointButtonControl';

import {
  getLayerById,
  getSortedPointFeatures,
  getDataFromCoords,
  getDataFromPointFeature,
} from '../../util/util';

import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';

import STYLES from './Popup.module.scss';

const c = classNames.bind(STYLES);

const ANIMATION_DURATION = 800;

class Popup extends Component {
  state = {
    isOpen: false,
    elevation: null,
    hdms: null,
    name: null,
    lonLat: [],
    sortedPointFeatures: [],
    sortedPoint: null,
    distanceInKm: null,
    elevationGainUp: null,
    elevationGainDown: null,
  };

  containerRef = React.createRef();

  componentDidMount() {
    const { map } = this.props;

    this.overlay = new Overlay({
      element: this.containerRef.current,
      autoPan: true,
      autoPanAnimation: {
        duration: ANIMATION_DURATION,
      },
      autoPanMargin: 50,
      stopEvent: false,
      positioning: 'top-center',
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
      const sortedPointFeatures = getSortedPointFeatures(gpxVectorLayer);
      this.setState({
        sortedPointFeatures,
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
    const { sortedPointFeatures, sortedPoint } = this.state;
    const sortedPointFeatureIndex = sortedPointFeatures.indexOf(sortedPoint);
    const nextPoint = sortedPointFeatures[sortedPointFeatureIndex + 1];
    this.openPopup(null, nextPoint.featurePoint);
  };

  onPrevPointButtonClick = () => {
    const { sortedPointFeatures, sortedPoint } = this.state;
    const sortedPointFeatureIndex = sortedPointFeatures.indexOf(sortedPoint);
    const prevPoint = sortedPointFeatures[sortedPointFeatureIndex - 1];
    this.openPopup(null, prevPoint.featurePoint);
  };

  onZoomInButotnClick = () => {
    const { lonLat } = this.state;
    const { map } = this.props;
    map.getView().animate({
      center: fromLonLat(lonLat),
      zoom: 18,
      duration: ANIMATION_DURATION,
      easing: easeOut,
    });
  };

  openPopup(evt, feature) {
    const { sortedPointFeatures } = this.state;
    const { map } = this.props;
    const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');
    const { name } = feature.getProperties();

    const nextState = {
      name,
      isOpen: true,
      distanceInKm: null,
      sortedPoint: null,
      elevationGainUp: null,
      elevationGainDown: null,
    };

    let coordinates = null;
    if (feature.getGeometry().getType() === 'MultiLineString') {
      coordinates = evt.coordinate;
    } else {
      coordinates = feature.getGeometry().getCoordinates();
      Object.assign(
        nextState,
        getDataFromPointFeature(feature, gpxVectorLayer, sortedPointFeatures)
      );
      nextState.distanceInKm = (nextState.distance / 1000).toFixed(2);
    }
    Object.assign(nextState, getDataFromCoords(coordinates));

    this.setState(nextState, () => this.overlay.setPosition(coordinates));
  }

  render() {
    const {
      elevation,
      hdms,
      name,
      isOpen,
      lonLat,
      distanceInKm,
      elevationGainUp,
      elevationGainDown,
      sortedPointFeatures,
      sortedPoint,
    } = this.state;
    const lon = (lonLat[0] || 0).toFixed(6);
    const lat = (lonLat[1] || 0).toFixed(6);
    const sortedPointFeatureIndex = sortedPointFeatures.indexOf(sortedPoint);
    const isPointFeature = sortedPointFeatureIndex !== -1;
    const hasNextPoint =
      isPointFeature &&
      sortedPointFeatureIndex < sortedPointFeatures.length - 1;
    const buttonProps = {
      className: c('Popup__button-control'),
    };
    return (
      <div ref={this.containerRef}>
        <Popover
          placement="bottom"
          isOpen={isOpen}
          target={() => this.containerRef.current}
          container={() => this.containerRef.current}
          toggle={this.toggle}
          className={c('Popup')}
          modifiers={{
            hide: { enabled: false },
            flip: { enabled: false },
            preventOverflow: { enabled: false },
          }}
        >
          <PopoverHeader>
            <CloseButtonControl onClick={this.onCloseButtonClick} />
            <MdHome size={20} style={{ verticalAlign: 'top' }} /> {name}
          </PopoverHeader>
          <PopoverBody>
            <div>Elevation: {elevation}m</div>
            <div>Longitude: {lon}</div>
            <div>Latitdue: {lat}</div>
            <div>Coordinates: {hdms}</div>
            {hasNextPoint && (
              <Fragment>
                <strong>Next Point</strong>
                {distanceInKm && <div>Distance: {distanceInKm}km</div>}
                {elevationGainUp && (
                  <div>Elevation gain up: {elevationGainUp}m</div>
                )}
                {elevationGainDown && (
                  <div>Elevation gain down: {elevationGainDown}m</div>
                )}
              </Fragment>
            )}
            <div style={{ paddingTop: '0.5rem' }}>
              <ZoomInButtonControl
                onClick={this.onZoomInButotnClick}
                tooltip="Zoom to Point"
                {...buttonProps}
              />
              {sortedPointFeatureIndex > 0 && (
                <PrevPointButtonControl
                  onClick={this.onPrevPointButtonClick}
                  tooltip="Previous Point"
                  {...buttonProps}
                />
              )}
              {hasNextPoint && (
                <NextPointButtonControl
                  onClick={this.onNextPointButtonClick}
                  tooltip="Next Point"
                  {...buttonProps}
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
