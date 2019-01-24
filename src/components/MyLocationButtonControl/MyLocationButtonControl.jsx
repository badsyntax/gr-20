import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdMyLocation } from 'react-icons/md';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';

import { getLayerById } from '../../util/util';

import ButtonControl from '../ButtonControl/ButtonControl';

import marker from './baseline-my_location-24px-yellow.svg';

const LAYER_ID = 'mylocation_layer';
const FEATURE_ID = 'mylocation_feature';
const ANIMATION_DURATION = 1000;

class FullScreenButtonControl extends Component {
  constructor(props) {
    super(props);
    const feature = new Feature({
      name: 'My Location',
    });
    feature.setId(FEATURE_ID);
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: marker,
        }),
      })
    );

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    });
    this.vectorLayer.set('id', LAYER_ID);
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.removeLayer(this.vectorLayer);
  }

  onButtonCLick = () => {
    const { showSpinner, map } = this.props;
    if ('geolocation' in navigator) {
      showSpinner(true);
      if (!getLayerById(map, LAYER_ID)) {
        map.addLayer(this.vectorLayer);
      }
      navigator.geolocation.getCurrentPosition(this.onGetCurrentPosition);
    } else {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported in your browser');
    }
  };

  onGetCurrentPosition = position => {
    const { showSpinner, map } = this.props;
    showSpinner(false);

    const coords = fromLonLat([
      position.coords.longitude,
      position.coords.latitude,
    ]);

    this.vectorLayer
      .getSource()
      .getFeatureById(FEATURE_ID)
      .setGeometry(new Point(coords));

    map.getView().animate({
      center: coords,
      duration: ANIMATION_DURATION,
    });
  };

  render() {
    const { map, showSpinner, ...rest } = this.props;
    return (
      <ButtonControl
        tooltipPlacement="right"
        onClick={this.onButtonCLick}
        {...rest}
      >
        <MdMyLocation />
      </ButtonControl>
    );
  }
}

FullScreenButtonControl.propTypes = {
  showSpinner: PropTypes.func.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
};

export default FullScreenButtonControl;
