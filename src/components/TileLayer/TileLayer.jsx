import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import 'core-js/features/array/flat';
import OSM from 'ol/source/OSM';
import Tile from 'ol/layer/Tile';
import { expandUrl } from 'ol/tileurlfunction';
import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';

import maps from '../../data/maps/maps';

const urls = maps.map(({ url }) => expandUrl(url)).flat();

class TileLayer extends Component {
  constructor(props) {
    super(props);
    this.xyzSource = new OSM();
    this.rasterLayer = new Tile({
      source: this.xyzSource,
    });
    this.rasterLayer.set('id', 'osmtilelayer');
  }

  componentDidMount() {
    const { map, mapUrl } = this.props;
    map.addLayer(this.rasterLayer);
    this.xyzSource.setUrl(mapUrl);
  }

  componentDidUpdate() {
    const { mapUrl } = this.props;
    this.xyzSource.setUrl(mapUrl);
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.removeLayer(this.rasterLayer);
  }

  render() {
    return (
      <Helmet>
        {urls.map((url) => (
          <link key={url} href={new URL(url).origin} rel="preconnect" />
        ))}
      </Helmet>
    );
  }
}

TileLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  mapUrl: PropTypes.string.isRequired,
};

const TileLayerContainer = (props) => (
  <OptionsContext.Consumer>
    {({ values }) => {
      const { mapUrl } = values;
      return (
        <MapContext.Consumer>
          {({ map }) => <TileLayer map={map} mapUrl={mapUrl} {...props} />}
        </MapContext.Consumer>
      );
    }}
  </OptionsContext.Consumer>
);

export default TileLayerContainer;
