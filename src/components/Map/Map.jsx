import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
// import sync from 'ol-hashed';

import 'ol/ol.css';

import STYLES from './Map.module.scss';

const initialState = {
  lat: 42.184207,
  lng: 9.1079,
  zoom: 9,
  mapReady: false,
  map: new OLMap({
    pixelRatio: 1,
    renderer: 'webgl',
    controls: [],
  }),
};

export const MapContext = React.createContext(initialState);

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    const { lat, lng, zoom, map } = this.state;
    const target = this.mapRef.current;
    const view = new View({
      center: fromLonLat([lng, lat]),
      zoom,
    });
    map.setTarget(target);
    map.setView(view);
    map.on('pointermove', this.onMapPointerMove);
    // sync(map);
  }

  componentWillUnmount() {
    const { map } = this.state;
    map.un('pointermove', this.onMapPointerMove);
  }

  onMapPointerMove = evt => {
    const { map } = this.state;
    if (evt.originalEvent.target.nodeName.toLowerCase() === 'canvas') {
      const pixel = map.getEventPixel(evt.originalEvent);
      const features = [];
      map.forEachFeatureAtPixel(pixel, feature => {
        features.push(feature);
      });
      if (features.length > 0) {
        map.getTarget().style.cursor = 'pointer';
      } else {
        map.getTarget().style.cursor = '';
      }
    }
  };

  render() {
    const { children } = this.props;
    return (
      <MapContext.Provider value={this.state}>
        <div className={STYLES.Map} ref={this.mapRef}>
          {children}
        </div>
      </MapContext.Provider>
    );
  }
}

Map.propTypes = {
  children: PropTypes.node,
};

Map.defaultProps = {
  children: null,
};

export default Map;
