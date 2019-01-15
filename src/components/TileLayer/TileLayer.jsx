import React, { Component } from 'react';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import OSM from 'ol/source/OSM';
import Tile from 'ol/layer/Tile';
import { MapContext } from '../Map/Map';
import { OptionsContext } from '../Options/OptionsProvider';

class TileLayer extends Component {
  componentDidMount() {
    const { map, mapUrl } = this.props;
    this.xyzSource = new OSM({
      url: mapUrl,
    });
    const rasterLayer = new Tile({
      source: this.xyzSource,
    });
    map.addLayer(rasterLayer);
  }

  componentDidUpdate() {
    const { mapUrl } = this.props;
    this.xyzSource.setUrl(mapUrl);
  }

  render() {
    return null;
  }
}

TileLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  mapUrl: PropTypes.string.isRequired,
};

export default props => (
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
