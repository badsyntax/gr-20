import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';

import 'ol/ol.css';
import 'react-vis/dist/style.css';

import Popup from '../Popup/Popup';
import Spinner from '../Spinner/Spinner';
import MapControls from '../MapControls/MapControls';
import GpxLayer from '../GpxLayer/GpxLayer';
import TileLayer from '../TileLayer/TileLayer';
import StartEndLayer from '../StartEndLayer/StartEndLayer';
import ElevationProfile from '../ElevationProfile/ElevationProfile';
import { SpinnerContext } from '../Spinner/SpinnerProvider';

import STYLES from './Map.module.scss';

class MyMap extends Component {
  state = {
    lat: 42.184207,
    lng: 9.1079,
    zoom: 9,
    mapReady: false,
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.popupContainerRef = React.createRef();
    this.popupContentRef = React.createRef();
    this.gpxVectorLayer = new VectorLayer();
    this.startEndVectorLayer = new VectorLayer();
    this.map = new Map({
      pixelRatio: 1,
      renderer: 'webgl',
      controls: [],
    });
  }

  componentDidMount() {
    const { map } = this;
    const { lat, lng, zoom } = this.state;
    const target = this.mapRef.current;

    const view = new View({
      center: fromLonLat([lng, lat]),
      zoom,
      // rotation: Math.PI / 6
    });

    map.setTarget(target);
    map.setView(view);
    map.addLayer(this.gpxVectorLayer);
    map.addLayer(this.startEndVectorLayer);

    map.on('pointermove', this.onMapPointerMove);

    this.setState({
      mapReady: true,
    });
  }

  componentWillUnmount() {
    const { map } = this;
    map.un('pointermove', this.onMapPointerMove);
  }

  onMapPointerMove = evt => {
    const { map } = this;
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

  onSourceChange = sourceLoaded => {
    const { onLoad } = this.props;
    onLoad(!sourceLoaded);
  };

  render() {
    const { mapReady } = this.state;
    const {
      showElevationProfile,
      mapUrl,
      gpxUrl,
      showControls,
      showMarkers,
      showRoute,
    } = this.props;
    return (
      <div ref={this.mapRef} className={STYLES.Map}>
        <Spinner />
        {mapReady && (
          <Fragment>
            <Popup map={this.map} gpxVectorLayer={this.gpxVectorLayer} />
            {showControls && (
              <MapControls
                map={this.map}
                gpxVectorLayer={this.gpxVectorLayer}
              />
            )}
            <ElevationProfile
              vectorLayer={this.gpxVectorLayer}
              map={this.map}
              isOpen={showElevationProfile}
            />
            <TileLayer mapUrl={mapUrl} map={this.map} />
            <GpxLayer
              vectorLayer={this.gpxVectorLayer}
              map={this.map}
              showElevationProfile={showElevationProfile}
              onSourceChange={this.onSourceChange}
              gpxUrl={gpxUrl}
              showMarkers={showMarkers}
              showRoute={showRoute}
            />
            <StartEndLayer
              map={this.map}
              gpxVectorLayer={this.gpxVectorLayer}
              vectorLayer={this.startEndVectorLayer}
              showMarkers={showMarkers}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

MyMap.propTypes = {
  mapUrl: PropTypes.string.isRequired,
  gpxUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  showControls: PropTypes.bool.isRequired,
  showMarkers: PropTypes.bool.isRequired,
  showRoute: PropTypes.bool.isRequired,
  onLoad: PropTypes.func,
};

MyMap.defaultProps = {
  onLoad: () => {},
};

export default props => (
  <SpinnerContext.Consumer>
    {({ toggle: onLoad }) => <MyMap onLoad={onLoad} {...props} />}
  </SpinnerContext.Consumer>
);
