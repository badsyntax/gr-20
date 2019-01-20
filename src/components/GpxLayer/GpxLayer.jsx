import React, { Component } from 'react';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import STATE from 'ol/source/State';

import GPX from 'ol/format/GPX';
import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';
import { SpinnerContext } from '../Spinner/SpinnerProvider';

import { getMultiLineStringFeature, getPointFeatures } from '../../util/util';

import STYLES from './styles';

const EXTENSIONS_TAG_NAME = 'gr20';

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
      feature => STYLES[feature.getGeometry().getType()]
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
    onSourceLoadStart();
    const format = new GPX({
      readExtensions(feature, extensionsNode) {
        if (!extensionsNode) {
          return;
        }
        const gr20Nodes = [
          ...extensionsNode.getElementsByTagName(EXTENSIONS_TAG_NAME),
        ];
        gr20Nodes.forEach(node => {
          const name = node.getAttribute('name');
          const text = node.textContent;
          feature.setProperties({
            [name]: text,
          });
        });
      },
    });
    const source = new VectorSource({
      url: gpxUrl,
      format,
    });
    this.vectorLayer.setSource(source);
    source.once('change', evt => {
      if (source.getState() === STATE.READY) {
        onSourceLoadEnd();
      }
    });
  }

  toggleMarkers(show) {
    const source = this.vectorLayer.getSource();
    if (show) {
      const { gpxMarkers } = this.state;
      gpxMarkers.forEach(markerPoint => source.addFeature(markerPoint));
    } else {
      const gpxMarkers = getPointFeatures(source.getFeatures());
      this.setState({
        gpxMarkers,
      });
      gpxMarkers.forEach(markerPoint => source.removeFeature(markerPoint));
    }
  }

  toggleRoute(show) {
    if (show) {
      const { multiLineFeature } = this.state;
      this.vectorLayer.getSource().addFeature(multiLineFeature);
    } else {
      const multiLineFeature = getMultiLineStringFeature(
        this.vectorLayer.getSource().getFeatures()
      );
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
