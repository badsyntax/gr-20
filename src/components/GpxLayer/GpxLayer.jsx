import React, { Component } from 'react';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import STATE from 'ol/source/State';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import GPX from 'ol/format/GPX';
import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';
import { SpinnerContext } from '../Spinner/SpinnerProvider';

const getMultiLineStringFeature = layer =>
  layer
    .getSource()
    .getFeatures()
    .find(feature => feature.getGeometry().getType() === 'MultiLineString');

const getPointFeatures = layer =>
  layer
    .getSource()
    .getFeatures()
    .filter(feature => feature.getGeometry().getType() === 'Point');

const style = {
  Point: new Style({
    image: new Circle({
      fill: new Fill({
        color: 'yellow',
      }),
      stroke: new Stroke({ color: 'rgba(0,60,136)', width: 1 }),
      radius: 5,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: 'rgba(0,60,136)',
      width: 4,
    }),
  }),
};

class GpxLayer extends Component {
  state = {
    gpxMarkers: [],
    multiLineFeature: null,
  };

  constructor(props) {
    super(props);
    this.vectorLayer = new VectorLayer();
    this.vectorLayer.set('id', 'gpxvectorlayer');
    this.vectorLayer.setStyle(
      feature => style[feature.getGeometry().getType()]
    );
  }

  componentDidMount() {
    const { map } = this.props;
    map.addLayer(this.vectorLayer);
    this.setSource();
  }

  componentDidUpdate(prevProps) {
    const { gpxUrl, showMarkers, showRoute } = this.props;
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSource();
    }
    if (prevProps.showMarkers !== showMarkers) {
      this.toggleMarkers(showMarkers);
    }
    if (prevProps.showRoute !== showRoute) {
      this.toggleRoute(showRoute);
    }
  }

  setSource() {
    const { gpxUrl, onSourceLoadStart, onSourceLoadEnd } = this.props;
    const source = new VectorSource({
      url: gpxUrl,
      format: new GPX(),
    });
    this.vectorLayer.setSource(source);
    onSourceLoadStart();
    source.once('change', evt => {
      if (source.getState() === STATE.READY) {
        onSourceLoadEnd();
      }
    });
  }

  toggleMarkers(show) {
    if (show) {
      const { gpxMarkers } = this.state;
      gpxMarkers.forEach(markerPoint =>
        this.vectorLayer.getSource().addFeature(markerPoint)
      );
    } else {
      const gpxMarkers = getPointFeatures(this.vectorLayer);
      this.setState({
        gpxMarkers,
      });
      gpxMarkers.forEach(markerPoint =>
        this.vectorLayer.getSource().removeFeature(markerPoint)
      );
    }
  }

  toggleRoute(show) {
    if (show) {
      const { multiLineFeature } = this.state;
      this.vectorLayer.getSource().addFeature(multiLineFeature);
    } else {
      const multiLineFeature = getMultiLineStringFeature(this.vectorLayer);
      this.setState({
        multiLineFeature,
      });
      this.vectorLayer.getSource().removeFeature(multiLineFeature);
    }
  }

  render() {
    return null;
  }
}

GpxLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  gpxUrl: PropTypes.string.isRequired,
  showMarkers: PropTypes.bool.isRequired,
  showRoute: PropTypes.bool.isRequired,
  onSourceLoadStart: PropTypes.func.isRequired,
  onSourceLoadEnd: PropTypes.func.isRequired,
};

export default props => (
  <SpinnerContext.Consumer>
    {({ toggle: showSpinner }) => (
      <OptionsContext.Consumer>
        {({ values }) => {
          const { showMarkers, showRoute, gpxUrl } = values;
          return (
            <MapContext.Consumer>
              {({ map }) => (
                <GpxLayer
                  map={map}
                  gpxUrl={gpxUrl}
                  showRoute={showRoute}
                  showMarkers={showMarkers}
                  onSourceLoadStart={() => showSpinner(true)}
                  onSourceLoadEnd={() => showSpinner(false)}
                  {...props}
                />
              )}
            </MapContext.Consumer>
          );
        }}
      </OptionsContext.Consumer>
    )}
  </SpinnerContext.Consumer>
);
